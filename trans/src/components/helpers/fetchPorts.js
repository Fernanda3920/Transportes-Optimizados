import axios from 'axios';

const fetchPorts = async (setLoading, portLimit, fetchAllPorts, setPorts) => {
  try {
    setLoading(true); // Mostrar el cargador
    const response = await axios.get(
      'https://overpass-api.de/api/interpreter?data=[out:json];(way["amenity"="port"];way["landuse"="port"];way["harbour"="yes"];);out geom;'
    );
    const allPorts = response.data.elements;
    const limitedPorts = fetchAllPorts ? allPorts : allPorts.slice(0, portLimit);
    const portsWithCountry = await Promise.all(limitedPorts.map(async element => {
      const lat = element.geometry ? element.geometry[0].lat : undefined;
      const lon = element.geometry ? element.geometry[0].lon : undefined;
      if (lat !== undefined && lon !== undefined) {
        const country = 'Germany';
        return {
          position: [lat, lon],
          name: element.tags.name || 'Unknown',
          type: element.tags.type || 'unknown',
          country
        };
      }
      return null;
    }));
    const validPorts = portsWithCountry.filter(port => port !== null);
    setPorts(validPorts);
  } catch (error) {
    console.error("Error fetching ports:", error);
  } finally {
    setLoading(false); // Ocultar el cargador
  }
};

export default fetchPorts;
