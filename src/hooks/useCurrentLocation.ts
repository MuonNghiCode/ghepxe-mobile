import { useState, useEffect, useCallback, useRef } from "react";
import * as Location from "expo-location";

interface LocationState {
  location: Location.LocationObject | null;
  address: string;
  error: string | null;
  loading: boolean;
}

interface UseCurrentLocationOptions {
  /** Có tự động lấy vị trí khi mount không */
  autoFetch?: boolean;
  /** Timeout cho việc lấy vị trí (ms) */
  timeout?: number;
  /** Độ chính xác vị trí */
  accuracy?: Location.LocationAccuracy;
  /** Có cache vị trí không */
  enableCache?: boolean;
  /** Thời gian cache hết hạn (ms) */
  cacheExpiry?: number;
}

interface CachedLocation {
  data: Location.LocationObject;
  address: string;
  timestamp: number;
}

const DEFAULT_CACHE_EXPIRY = 5 * 60 * 1000; // 5 phút

export function useCurrentLocation(options: UseCurrentLocationOptions = {}) {
  const {
    autoFetch = true,
    timeout = 15000,
    accuracy = Location.LocationAccuracy.Balanced,
    enableCache = true,
    cacheExpiry = DEFAULT_CACHE_EXPIRY
  } = options;

  const [state, setState] = useState<LocationState>({
    location: null,
    address: "Đang lấy vị trí...",
    error: null,
    loading: autoFetch,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const cacheRef = useRef<CachedLocation | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Check cache validity
  const getCachedLocation = useCallback((): CachedLocation | null => {
    if (!enableCache || !cacheRef.current) return null;
    
    const now = Date.now();
    if (now - cacheRef.current.timestamp > cacheExpiry) {
      cacheRef.current = null;
      return null;
    }
    
    return cacheRef.current;
  }, [enableCache, cacheExpiry]);

  // Set cache
  const setCachedLocation = useCallback((location: Location.LocationObject, address: string) => {
    if (!enableCache) return;
    
    cacheRef.current = {
      data: location,
      address,
      timestamp: Date.now()
    };
  }, [enableCache]);

  // Safe state update
  const safeSetState = useCallback((updater: (prev: LocationState) => LocationState) => {
    if (isMountedRef.current) {
      setState(updater);
    }
  }, []);

  // Format address with better logic
  const formatAddress = useCallback((addressComponents: Location.LocationGeocodedAddress[]): string => {
    if (!addressComponents || addressComponents.length === 0) {
      return "Không xác định được địa chỉ";
    }

    const component = addressComponents[0];
    const parts = [
      component.name || component.street,
      component.streetNumber && component.name ? `${component.streetNumber} ${component.name}` : null,
      component.district || component.subregion,
      component.city || component.region,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Không xác định được địa chỉ";
  }, []);

  const fetchLocation = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh) {
      const cached = getCachedLocation();
      if (cached) {
        safeSetState(prev => ({
          ...prev,
          location: cached.data,
          address: cached.address,
          error: null,
          loading: false
        }));
        return;
      }
    }

    // Cleanup previous request
    cleanup();

    // Start new request
    abortControllerRef.current = new AbortController();
    
    safeSetState(prev => ({
      ...prev,
      loading: true,
      error: null,
      address: "Đang lấy vị trí..."
    }));

    try {
      // Check permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        throw new Error("Không có quyền truy cập vị trí. Vui lòng cấp quyền trong Cài đặt.");
      }

      // Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        throw new Error("GPS chưa được bật. Vui lòng bật định vị trong Cài đặt.");
      }

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) return;

      // Try with last known location first (faster)
      let location: Location.LocationObject;
      
      try {
        // Get last known location quickly
        const lastKnown = await Location.getLastKnownPositionAsync({
          maxAge: 5 * 60 * 1000, // Accept location up to 5 minutes old
          requiredAccuracy: 1000, // Accept accuracy up to 1km
        });
        
        if (lastKnown && !forceRefresh) {
          location = lastKnown;
        } else {
          throw new Error("Need fresh location");
        }
      } catch {
        // Fallback to current position with progressive accuracy
        const accuracyLevels = [
          { accuracy: Location.LocationAccuracy.Low, timeout: 10000 },
          { accuracy: Location.LocationAccuracy.Balanced, timeout: 15000 },
          { accuracy: Location.LocationAccuracy.High, timeout: 20000 }
        ];

        let lastError;
        for (const level of accuracyLevels) {
          try {
            safeSetState(prev => ({
              ...prev,
              address: `Đang lấy vị trí (độ chính xác: ${level.accuracy})...`
            }));

            const locationPromise = Location.getCurrentPositionAsync({
              accuracy: level.accuracy,
              timeInterval: 1000,
              distanceInterval: 1,
            });

            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error(`Timeout sau ${level.timeout/1000}s`)), level.timeout);
            });

            location = await Promise.race([locationPromise, timeoutPromise]);
            break; // Success, exit loop

          } catch (error) {
            lastError = error;
            if (abortControllerRef.current?.signal.aborted) return;
            
            // Continue to next accuracy level
            console.warn(`Failed with accuracy ${level.accuracy}:`, error);
          }
        }

        if (!location!) {
          throw lastError || new Error("Không thể lấy vị trí với bất kỳ độ chính xác nào");
        }
      }

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) return;

      // Get address
      let address = "Không xác định được địa chỉ";
      try {
        const addressArr = await Location.reverseGeocodeAsync(location.coords);
        address = formatAddress(addressArr);
      } catch (addressError) {
        console.warn("Không thể lấy địa chỉ:", addressError);
        // Không throw error, chỉ để address mặc định
      }

      // Cache the result
      setCachedLocation(location, address);

      // Update state
      safeSetState(prev => ({
        ...prev,
        location,
        address,
        error: null,
        loading: false
      }));

    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) return;

      let errorMessage = "Lỗi không xác định khi lấy vị trí";
      
      if (error instanceof Error) {
        if (error.message.includes("Timeout")) {
          errorMessage = "Không thể lấy vị trí. Hãy thử:\n• Ra nơi thoáng đãng\n• Bật GPS độ chính xác cao\n• Khởi động lại GPS";
        } else if (error.message.includes("GPS")) {
          errorMessage = "GPS chưa được bật. Vui lòng bật định vị trong Cài đặt.";
        } else if (error.message.includes("quyền")) {
          errorMessage = error.message;
        } else {
          errorMessage = `Lỗi GPS: ${error.message}`;
        }
      }
      
      safeSetState(prev => ({
        ...prev,
        error: errorMessage,
        address: errorMessage,
        loading: false
      }));
    }
  }, [cleanup, getCachedLocation, safeSetState, formatAddress, setCachedLocation]);

  // Force refresh function
  const refresh = useCallback(() => fetchLocation(true), [fetchLocation]);

  // Check if location services are enabled
  const checkLocationServices = useCallback(async (): Promise<boolean> => {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch {
      return false;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchLocation(false);
    }
  }, [autoFetch, fetchLocation]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    ...state,
    refresh,
    fetchLocation,
    checkLocationServices,
    // Computed properties
    hasLocation: !!state.location,
    hasError: !!state.error,
    isReady: !state.loading && (!!state.location || !!state.error),
    
    // Location utilities
    coordinates: state.location?.coords || null,
    timestamp: state.location?.timestamp || null,
  };
}