import polyline from '@mapbox/polyline';

const optimizeRoute = async (currentLocation, destinationCoordinates, vehicleType, setOptimizedRoute) => {
  if (!currentLocation || !destinationCoordinates) {
    console.error('currentLocation o destinationCoordinates no están definidos');
    return;
  }

  try {
    if (vehicleType === 'airplane') {
      const points = [
        { lat: currentLocation.lat, lng: currentLocation.lng },
        { lat: destinationCoordinates.lat, lng: destinationCoordinates.lng }
      ];
      setOptimizedRoute({
        points,
        distance: getDistance(currentLocation, destinationCoordinates),
        time: getFlightTime(currentLocation, destinationCoordinates),
        instructions: [] // No hay instrucciones para el vuelo
      });
    } else {
      const apiKey = 'api_key';
      const response = await fetch(
        `https://graphhopper.com/api/1/route?point=${currentLocation.lat},${currentLocation.lng}&point=${destinationCoordinates.lat},${destinationCoordinates.lng}&vehicle=${vehicleType}&locale=es&instructions=true&key=${apiKey}`
      );
      const data = await response.json();
      if (data.paths && data.paths.length > 0) {
        const decodedPoints = polyline.decode(data.paths[0].points);
        const points = decodedPoints.map(([lat, lng]) => ({ lat, lng }));
        setOptimizedRoute({
          points,
          distance: data.paths[0].distance,
          time: data.paths[0].time,
          instructions: data.paths[0].instructions || []
        });
      } else {
        console.error('No se pudo optimizar la ruta.');
      }
    }
  } catch (error) {
    console.error('Error al optimizar ruta:', error);
  }
};

export default optimizeRoute;
