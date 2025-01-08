const handleDestinationChange = async (event, setDestination, setSuggestions, setCountry) => {
    const value = event.target.value;
    setDestination(value);
  
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(value)}&key=api_key`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Error al obtener sugerencias. Código de error: ${response.status} - ${response.statusText}`);
      }
      if (data.results.length > 0) {
        setSuggestions(data.results.slice(0, 5));
        const countryCode = data.results[0].components.country_code.toUpperCase();
        setCountry(countryCode);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };
  
  export default handleDestinationChange;
  