
import axios from 'axios';

const searchParking = async (destination, setMapCenter, setParkingData) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`);
    const { lat, lon } = response.data[0];
    const newMapCenter = [parseFloat(lat), parseFloat(lon)];
    setMapCenter(newMapCenter);

    // Fetch parking data
    const query = `
      [out:json];
      node
        ["amenity"="parking"]
        (around:10000,${newMapCenter[0]},${newMapCenter[1]});
      out body;
    `;
    const parkingResponse = await axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`);
    const parkingNodes = parkingResponse.data.elements;

    const parkingDetailsRequests = parkingNodes.map(parking =>
      axios.get(`https://api.openstreetmap.org/api/0.6/node/${parking.id}.json`)
    );

    const parkingDetailsResponses = await Promise.all(parkingDetailsRequests);
    const parkingDetails = parkingDetailsResponses.map((response, index) => {
      const parkingDetail = response.data.elements[0];
      return {
        ...parkingNodes[index],
        name: parkingDetail.tags && parkingDetail.tags.name ? parkingDetail.tags.name : 'Unnamed Parking',
        details: parkingDetail.tags,
      };
    });

    setParkingData(parkingDetails);
  } catch (error) {
    console.error("Error fetching geocoding data or parking data:", error);
  }
};

export default searchParking;
