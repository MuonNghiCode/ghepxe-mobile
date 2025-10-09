import { useState, useCallback, useRef, useEffect } from 'react';
import MapView from 'react-native-maps';
import { LOCATIONIQ_API_KEY } from '@env';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseOrderMapProps {
  pickupCoordinates: Coordinates;
  deliveryCoordinates: Coordinates;
  customerCoordinates?: Coordinates[]; // cho đơn ghép
  enableVietnameseRoute?: boolean; // cho user order
  orderType?: 'single' | 'grouped';
}

export const useOrderMap = ({
  pickupCoordinates,
  deliveryCoordinates,
  customerCoordinates = [],
  enableVietnameseRoute = false,
  orderType = 'single',
}: UseOrderMapProps) => {
  const mapRef = useRef<MapView>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const calculateDistance = useCallback((
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Hàm tìm đường đi ngắn nhất qua tất cả customer points (TSP problem)
  const findOptimalRoute = useCallback((
    start: Coordinates,
    end: Coordinates,
    customers: Coordinates[]
  ) => {
    if (customers.length === 0) {
      return [start, end];
    }

    // Nếu chỉ có 1 customer
    if (customers.length === 1) {
      return [start, customers[0], end];
    }

    // Với nhiều customers, dùng nearest neighbor algorithm
    const unvisited = [...customers];
    const route = [start];
    let current = start;

    while (unvisited.length > 0) {
      let nearest = unvisited[0];
      let nearestIndex = 0;
      let shortestDistance = calculateDistance(
        current.latitude,
        current.longitude,
        nearest.latitude,
        nearest.longitude
      );

      // Tìm customer gần nhất
      for (let i = 1; i < unvisited.length; i++) {
        const dist = calculateDistance(
          current.latitude,
          current.longitude,
          unvisited[i].latitude,
          unvisited[i].longitude
        );
        if (dist < shortestDistance) {
          shortestDistance = dist;
          nearest = unvisited[i];
          nearestIndex = i;
        }
      }

      route.push(nearest);
      current = nearest;
      unvisited.splice(nearestIndex, 1);
    }

    route.push(end);
    return route;
  }, [calculateDistance]);

  const getVietnameseWaypoints = useCallback((
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ) => {
    const waypoints = [];
    const distance = Math.abs(fromLat - toLat);

    if (distance > 5) {
      if (fromLat > toLat) {
        waypoints.push(
          { latitude: 20.5, longitude: 106.0 },
          { latitude: 18.5, longitude: 105.8 },
          { latitude: 16.0, longitude: 108.2 },
          { latitude: 14.0, longitude: 109.0 },
          { latitude: 12.0, longitude: 109.2 }
        );
      } else {
        waypoints.push(
          { latitude: 12.0, longitude: 109.2 },
          { latitude: 14.0, longitude: 109.0 },
          { latitude: 16.0, longitude: 108.2 },
          { latitude: 18.5, longitude: 105.8 },
          { latitude: 20.5, longitude: 106.0 }
        );
      }
    }
    return waypoints;
  }, []);

  const createFallbackRoute = useCallback(() => {
    let route: Coordinates[] = [];

    if (orderType === 'grouped' && customerCoordinates.length > 0) {
      // Đơn ghép: tìm đường đi tối ưu qua tất cả customers
      route = findOptimalRoute(pickupCoordinates, deliveryCoordinates, customerCoordinates);
    } else if (enableVietnameseRoute) {
      // Đơn lẻ User: Vietnamese route logic
      const route1APoints = [
        pickupCoordinates,
        { latitude: 20.5, longitude: 106.0 },
        { latitude: 18.5, longitude: 105.8 },
        { latitude: 16.0, longitude: 108.2 },
        { latitude: 14.0, longitude: 109.0 },
        { latitude: 12.0, longitude: 109.2 },
        { latitude: 11.0, longitude: 108.0 },
        deliveryCoordinates,
      ];

      route = route1APoints.filter((point) => {
        if (pickupCoordinates.latitude > deliveryCoordinates.latitude) {
          return point.latitude <= pickupCoordinates.latitude && 
                 point.latitude >= deliveryCoordinates.latitude;
        } else {
          return point.latitude >= pickupCoordinates.latitude && 
                 point.latitude <= deliveryCoordinates.latitude;
        }
      });
    } else {
      // Đơn lẻ Driver: simple mock route
      route = [
        pickupCoordinates,
        {
          latitude: pickupCoordinates.latitude + 
                   (deliveryCoordinates.latitude - pickupCoordinates.latitude) * 0.25,
          longitude: pickupCoordinates.longitude + 
                    (deliveryCoordinates.longitude - pickupCoordinates.longitude) * 0.25,
        },
        {
          latitude: pickupCoordinates.latitude + 
                   (deliveryCoordinates.latitude - pickupCoordinates.latitude) * 0.5,
          longitude: pickupCoordinates.longitude + 
                    (deliveryCoordinates.longitude - pickupCoordinates.longitude) * 0.5,
        },
        {
          latitude: pickupCoordinates.latitude + 
                   (deliveryCoordinates.latitude - pickupCoordinates.latitude) * 0.75,
          longitude: pickupCoordinates.longitude + 
                    (deliveryCoordinates.longitude - pickupCoordinates.longitude) * 0.75,
        },
        deliveryCoordinates,
      ];
    }

    setRouteCoordinates(route);

    // Calculate distance and duration for fallback route
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += calculateDistance(
        route[i].latitude,
        route[i].longitude,
        route[i + 1].latitude,
        route[i + 1].longitude
      );
    }

    const estimatedHours = totalDistance / 50;
    let durationText;
    if (estimatedHours >= 1) {
      const hours = Math.floor(estimatedHours);
      const minutes = Math.round((estimatedHours - hours) * 60);
      durationText = minutes > 0 ? `${hours}h ${minutes}p` : `${hours}h`;
    } else {
      const minutes = Math.round(estimatedHours * 60);
      durationText = `${minutes} phút`;
    }

    setDistance(`${totalDistance.toFixed(0)} km`);
    setDuration(durationText);
  }, [pickupCoordinates, deliveryCoordinates, enableVietnameseRoute, orderType, customerCoordinates, findOptimalRoute, calculateDistance]);

  const getDirections = useCallback(async () => {
    try {
      let waypoints: Coordinates[] = [];

      if (orderType === 'grouped' && customerCoordinates.length > 0) {
        // Đơn ghép: tìm route tối ưu qua tất cả customers
        const optimalRoute = findOptimalRoute(pickupCoordinates, deliveryCoordinates, customerCoordinates);
        waypoints = optimalRoute.slice(1, -1); // Loại bỏ điểm đầu và cuối
      } else if (enableVietnameseRoute) {
        // Đơn lẻ User: Vietnamese waypoints
        waypoints = getVietnameseWaypoints(
          pickupCoordinates.latitude,
          pickupCoordinates.longitude,
          deliveryCoordinates.latitude,
          deliveryCoordinates.longitude
        );
      }

      const origin = `${pickupCoordinates.longitude},${pickupCoordinates.latitude}`;
      const destination = `${deliveryCoordinates.longitude},${deliveryCoordinates.latitude}`;

      let url;
      if (waypoints.length > 0) {
        const waypointStr = waypoints
          .map((wp) => `${wp.longitude},${wp.latitude}`)
          .join(";");
        url = `https://us1.locationiq.com/v1/directions/driving/${origin};${waypointStr};${destination}?key=${LOCATIONIQ_API_KEY}&steps=true&geometries=geojson&overview=full&exclude=ferry`;
      } else {
        url = `https://us1.locationiq.com/v1/directions/driving/${origin};${destination}?key=${LOCATIONIQ_API_KEY}&steps=true&geometries=geojson&overview=full&exclude=ferry`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationHours = route.duration / 3600;

        let durationText;
        if (durationHours >= 1) {
          const hours = Math.floor(durationHours);
          const minutes = Math.round((durationHours - hours) * 60);
          durationText = minutes > 0 ? `${hours}h ${minutes}p` : `${hours}h`;
        } else {
          const minutes = Math.round(durationHours * 60);
          durationText = `${minutes} phút`;
        }

        setDistance(`${distanceKm} km`);
        setDuration(durationText);

        const coordinates = route.geometry.coordinates.map(
          (coord: number[]) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );

        setRouteCoordinates(coordinates);
      } else {
        createFallbackRoute();
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      createFallbackRoute();
    }
  }, [pickupCoordinates, deliveryCoordinates, enableVietnameseRoute, orderType, customerCoordinates, getVietnameseWaypoints, findOptimalRoute, createFallbackRoute]);

  const fitMapToCoordinates = useCallback(() => {
    if (mapRef.current && routeCoordinates.length > 0) {
      const coordinates = routeCoordinates.length > 2
        ? routeCoordinates
        : [pickupCoordinates, deliveryCoordinates];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [routeCoordinates, pickupCoordinates, deliveryCoordinates]);

  useEffect(() => {
    getDirections();
  }, [getDirections]);

  useEffect(() => {
    if (routeCoordinates.length > 0) {
      setTimeout(() => {
        fitMapToCoordinates();
      }, 1000);
    }
  }, [routeCoordinates, fitMapToCoordinates]);

  return {
    mapRef,
    routeCoordinates,
    distance,
    duration,
    fitMapToCoordinates,
  };
};