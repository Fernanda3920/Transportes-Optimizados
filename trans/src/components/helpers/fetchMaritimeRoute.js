import axios from 'axios';

const fetchMaritimeRoute = async (start, end) => {
  const apiKey = 'api_key';
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const response = await axios.get(url);
    const coordinates = response.data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    return coordinates;
  } catch (error) {
    console.error('Error fetching maritime route:', error);
    return [];
  }
};

export default fetchMaritimeRoute;
