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
  customerCoordinates?: Coordinates[]; 
  enableVietnameseRoute?: boolean; 
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
  const [hasInitiallyFit, setHasInitiallyFit] = useState(false);

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

  const findOptimalRoute = useCallback((
    start: Coordinates,
    end: Coordinates,
    customers: Coordinates[]
  ) => {
    if (customers.length === 0) {
      return [start, end];
    }
    if (customers.length === 1) {
      return [start, customers[0], end];
    }

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

  const createFallbackRoute = useCallback(() => {
    setRouteCoordinates([]);
    
    let totalDistance = 0;
    
    if (orderType === 'grouped' && customerCoordinates.length > 0) {
      const optimalRoute = findOptimalRoute(pickupCoordinates, deliveryCoordinates, customerCoordinates);
      for (let i = 0; i < optimalRoute.length - 1; i++) {
        totalDistance += calculateDistance(
          optimalRoute[i].latitude,
          optimalRoute[i].longitude,
          optimalRoute[i + 1].latitude,
          optimalRoute[i + 1].longitude
        );
      }
    } else {
      totalDistance = calculateDistance(
        pickupCoordinates.latitude,
        pickupCoordinates.longitude,
        deliveryCoordinates.latitude,
        deliveryCoordinates.longitude
      );
    }

    const estimatedHours = totalDistance / 40;
    let durationText;
    if (estimatedHours >= 1) {
      const hours = Math.floor(estimatedHours);
      const minutes = Math.round((estimatedHours - hours) * 60);
      durationText = minutes > 0 ? `~${hours}h ${minutes}p` : `~${hours}h`;
    } else {
      const minutes = Math.round(estimatedHours * 60);
      durationText = `~${minutes} phút`;
    }

    setDistance(`~${totalDistance.toFixed(0)} km`);
    setDuration(durationText);
  }, [pickupCoordinates, deliveryCoordinates, orderType, customerCoordinates, findOptimalRoute, calculateDistance]);

  const getDirections = useCallback(async () => {
    try {
      let waypoints: Coordinates[] = [];

      if (orderType === 'grouped' && customerCoordinates.length > 0) {
        const optimalRoute = findOptimalRoute(pickupCoordinates, deliveryCoordinates, customerCoordinates);
        waypoints = optimalRoute.slice(1, -1); 
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

        // Chuyển đổi coordinates từ LocationIQ format
        const coordinates = route.geometry.coordinates.map(
          (coord: number[]) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );

        console.log('Route coordinates count:', coordinates.length);
        setRouteCoordinates(coordinates);
      } else {
        console.log('No routes found, using fallback');
        createFallbackRoute();
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      createFallbackRoute();
    }
  }, [pickupCoordinates, deliveryCoordinates, orderType, customerCoordinates, findOptimalRoute, createFallbackRoute]);

  const fitMapToCoordinates = useCallback(() => {
    if (mapRef.current) {
      let coordinates: Coordinates[] = [];
      
      if (routeCoordinates.length > 2) {

        coordinates = routeCoordinates;
      } else {

        coordinates = [pickupCoordinates, deliveryCoordinates, ...customerCoordinates];
      }

      if (coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
        });
      }
    }
  }, [routeCoordinates, pickupCoordinates, deliveryCoordinates, customerCoordinates]);

  const autoFitMapToCoordinates = useCallback(() => {
    if (mapRef.current && !hasInitiallyFit) {
      let coordinates: Coordinates[] = [];
      
      if (routeCoordinates.length > 2) {
        coordinates = routeCoordinates;
      } else {
        coordinates = [pickupCoordinates, deliveryCoordinates, ...customerCoordinates];
      }

      if (coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
        });
        
        setHasInitiallyFit(true);
      }
    }
  }, [routeCoordinates, pickupCoordinates, deliveryCoordinates, customerCoordinates, hasInitiallyFit]);

  useEffect(() => {
    getDirections();
  }, [getDirections]);

  useEffect(() => {
    if (routeCoordinates.length > 0 || (!hasInitiallyFit && pickupCoordinates && deliveryCoordinates)) {
      setTimeout(() => {
        autoFitMapToCoordinates();
      }, 1000);
    }
  }, [routeCoordinates, autoFitMapToCoordinates, pickupCoordinates, deliveryCoordinates, hasInitiallyFit]);

  return {
    mapRef,
    routeCoordinates,
    distance,
    duration,
    fitMapToCoordinates,
  };
};