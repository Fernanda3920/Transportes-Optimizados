export const fetchRailwayData = async (country) => {
    const query = `
      [out:json][timeout:25];
      area["ISO3166-1"="${country}"][admin_level=2];
      (
        node["railway"="station"](area);
        way["railway"](area);
      );
      out body;
      >;
      out skel qt;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      console.log('Railway API Response:', data); // Registrar la respuesta de la API para depurar
      const filteredData = data.elements.filter(element => ['node', 'way'].includes(element.type));
      return filteredData;
    } catch (error) {
      console.error('Error fetching railway data:', error);
      throw error;
    }
  };
  