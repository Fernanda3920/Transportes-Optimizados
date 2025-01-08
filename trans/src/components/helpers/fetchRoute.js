import polyline from '@mapbox/polyline';

export const fetchRoute = async (selectedStations, setRoute, setRouteDetails) => {
  if (selectedStations.length > 1) {
    const points = selectedStations.map(station => `${station.lat},${station.lon}`).join('&point=');
    const url = `https://graphhopper.com/api/1/route?point=${points}&vehicle=foot&locale=es&key=8bfb01f1-4e92-4260-abf0-7e19014f7b5c`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching route data');
      }
      const data = await response.json();
      console.log('Route API Response:', data); // Registrar la respuesta de la API para depurar
      if (data.paths && data.paths[0] && data.paths[0].points) {
        const routePoints = polyline.decode(data.paths[0].points).map(point => [point[0], point[1]]);
        setRoute(routePoints);
        const { distance, time } = data.paths[0];
        setRouteDetails({
          distance: (distance / 1000).toFixed(2), // Convertir metros a kilómetros
          time: (time / 60).toFixed(2) // Convertir milisegundos a minutos
        });
      } else {
        throw new Error('Invalid route data');
      }
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  }
};
