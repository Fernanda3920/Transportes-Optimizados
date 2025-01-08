import React, { useEffect } from 'react';
import axios from 'axios';

const RoutesTrain = ({ setRoutes, setLoading }) => {
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://overpass-api.de/api/interpreter?data=[out:json];way["highway"="path"](around:1000,50.0,10.0);out geom;'
        );
        const routeData = response.data.elements.map(element => ({
          coordinates: element.geometry.map(geom => [geom.lat, geom.lon])
        }));
        setRoutes(routeData);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [setRoutes, setLoading]);

  return null;
};

export default RoutesTrain;
