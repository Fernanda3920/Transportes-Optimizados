import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';  // Estilo de hojas de boostrap
import '@fortawesome/fontawesome-free/css/all.min.css'; // Iconos
import './components/styles/Navbar.css' // Estilo del navbar
import './components/styles/Loader.css'; // Estilo del loader
import { fetchRailwayData } from './components/helpers/fetchRailwayData'; // Buscar trenes 
import searchParking from './components/helpers/searchParking';   // Bucar Parking
import fetchPorts from './components/helpers/fetchPorts';
import formatTime from './components/helpers/formatTime.js';
import { fetchRoute } from './components/helpers/fetchRoute.js';
import Navbar from './components/Navbar'; // Componente de los botones Lugares turisticos, Hoteles y restaurantes
import Weather from './components/Weather'; // Componente de clima
import TomTomTraffic from './components/TrafficControl';  // Componente de alerta del trafico
import MapComponent from './components/MapComponent';
import fetchFlickrImages from './components/fetchFlickrImages.jsx' // Componente de imagenes del destino
import Loader from './components/Loader';
import SpeechSynthesis from './components/SpeechSynthesis'; // Importa el nuevo componente SpeechSynthesis
import Ports from './components/Ports.jsx';
import optimizeRoute from './components/helpers/optimizeRoute.js';
import SearchBar from './components/SearchBar';
import RoutesTrain from './components/RoutesTrain';
import handleDestinationChange from './components/helpers/handleDestinationChange.js';
import StationDetails from './components/StationDetail.jsx';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState({ points: [], distance: 0, time: 0, instructions: [] });
  const [vehicleType, setVehicleType] = useState('car');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [flickrImages, setFlickrImages] = useState([]);
  const [showWeatherBar, setShowWeatherBar] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [showPorts, setShowPorts] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [parkingData, setParkingData] = useState([]);
  const [showParkingPopups, setShowParkingPopups] = useState(false); // Estado para mostrar los popups de estacionamientos
  const [showTransportTrain, setShowTransportTrain] = useState(false); // Estado para mostrar el componente TransportTrain
  const [mapCenter, setMapCenter] = useState([0, 0]); // Definir setMapCenter
  const [railways, setRailways] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [route, setRoute] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null); // Para almacenar detalles de la ruta
  const [country, setCountry] = useState('IT'); // Estado para el país seleccionado
  const [fetching, setFetching] = useState(false); // Estado para manejar el botón de búsqueda
  const [routes, setRoutes] = useState([]);
  const [ports, setPorts] = useState([]);
  const [selectedPorts, setSelectedPorts] = useState([]);
  const [portLimit, setPortLimit] = useState(50); // Estado para el límite de puertos
  const [fetchAllPorts, setFetchAllPorts] = useState(false); // Estado para cargar todos los puertos
  const [loading, setLoading] = useState(false); // Estado para mostrar el cargador
  const mapRef = useRef();
 
  const handleSearch = (dataFromNavbar) => {
    setBusinesses(dataFromNavbar.businesses);
  };
  const handlePortsSelected = (lat, lng, name) => {
    setSelectedPorts(prevPorts => [
      ...prevPorts,
      { lat, lng, name }
    ]);
  };  
  const handlePortsClick = () => {
    if (!destination) {
      alert("Por favor, ingrese un destino antes de continuar.");
      return false;
    }
    setShowPorts(prevShowPorts => !prevShowPorts);
    if (!showPorts) {
      fetchPorts(setLoading, portLimit, fetchAllPorts, setPorts);  // Usar la función fetchPorts
    }
  };

  useEffect(() => {
    if (fetchAllPorts) {
      fetchPorts(setLoading, portLimit, fetchAllPorts, setPorts);  // Usar la función fetchPorts
    }
  }, [fetchAllPorts, portLimit]);

  const handleClearMap = () => {
    setOptimizedRoute({ points: [], distance: 0, time: 0, instructions: [] });
    setRailways([]);
    setParkingData([]);
    setRoute(null);
    setSelectedStations([]);
    setSelectedPlace(null);
    setBusinesses([]);
    setPorts([]);
    setShowPorts(false);
  };

  useEffect(() => {
    fetchRoute(selectedStations, setRoute, setRouteDetails); // Utiliza la función desde el helper
  }, [selectedStations]);

  const handleStationClick = (station) => {
    setSelectedStations(prevStations => {
      const alreadySelected = prevStations.some(s => s.id === station.id);
      if (alreadySelected) {
        return prevStations.filter(s => s.id !== station.id);
      } else {
        return [...prevStations, station];
      }
    });
  };
  
  const handleSearchClick = async () => {
    if (!destination) {
      alert("Por favor, ingrese un destino antes de continuar.");
      return false;
    }
    if (showTransportTrain) {
      setShowTransportTrain(false);
    } else {
      setFetching(true);
      try {
        const data = await fetchRailwayData(country);
        setRailways(data);
        setShowTransportTrain(true);
      } catch (error) {
        console.error('Error fetching railway data:', error);
      } finally {
        setFetching(false);
      }
    }
  };
    
  const handleParkingClick = () => {
    if (!destination) {
      alert("Por favor, ingrese un destino antes de continuar.");
      return false;
    }
    if (showParkingPopups) {
      setShowParkingPopups(false);
    } else {
      setShowParkingPopups(true);
      searchParking(destination, setMapCenter, setParkingData);
    }
  };
  
  const handleDestinationChangeWrapper = (event) => {
    handleDestinationChange(event, setDestination, setSuggestions, setCountry);
  };


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleSuggestionSelect = async (suggestion) => {
    setSelectedPlace(suggestion);
    setDestination(suggestion.formatted);
    setSuggestions([]);
  };

  const searchDestination = async () => {
    if (selectedPlace) {
      const { lat, lng } = selectedPlace.geometry;
      setDestinationCoordinates({ lat, lng });
      fetchFlickrImages(selectedPlace.formatted, setFlickrImages);
      const map = mapRef.current;
      if (map) {
        map.setView([lat, lng], 13);
      }
    }
  };
  
  const handleVehicleChange = (event) => {
    setVehicleType(event.target.value);
  };

  const handleOptimizeRoute = async () => {
    if (currentLocation && destinationCoordinates && vehicleType) {
      await optimizeRoute(
        currentLocation,
        destinationCoordinates,
        vehicleType,
        setOptimizedRoute
      );
    } else {
      console.error('Datos necesarios no disponibles para optimizar la ruta.');
    }
  };
  const handleSetDestination = (lat, lng, name) => {
    setDestination(name); // Actualiza el nombre del destino
    setDestinationCoordinates({ lat, lng }); // Actualiza las coordenadas del destino
  };
  

  return (
    <div className="app-container">
       {loading && <Loader />}
      <div className="left-panel">
        <h1>Runs!</h1>
       <div className="form-group">
       <SearchBar 
        destination={destination}
        onDestinationChange={handleDestinationChangeWrapper}
        onSearch={searchDestination}
        vehicleType={vehicleType}
        onVehicleChange={handleVehicleChange}
        suggestions={suggestions}
        onSuggestionSelect={handleSuggestionSelect}
        destinationCoordinates={destinationCoordinates}
        currentLocation={currentLocation}
        onOptimizeRoute={handleOptimizeRoute}
      />
      <RoutesTrain setRoutes={setRoutes} setLoading={setLoading} />
        </div>
        <Ports 
          showPorts={showPorts}
          setPortLimit={setPortLimit}
          portLimit={portLimit}
          fetchAllPorts={fetchAllPorts}
          setFetchAllPorts={setFetchAllPorts}
          fetchPorts={fetchPorts}
        />
         <div style={{ marginBottom: '20px' }}>
         {fetching && <Loader />}
        {selectedStations.map((station, index) => (
          <StationDetails key={index} station={station} />
        ))}
      </div>
        {flickrImages.length > 0 && (
          <div className="flickr-images-container">
            <h3>{selectedPlace && selectedPlace.formatted}</h3>
            <div className="flickr-images">
              {flickrImages.map((image, index) => (
                <img key={index} src={image.url} alt={image.title} className="flickr-image" />
              ))}
            </div>
          </div>
        )}
        {optimizedRoute.points.length > 0 && (
          <div>
            <h3>Detalles de la Ruta:</h3>
            <p>Distancia total: {(optimizedRoute.distance / 1000).toFixed(2)} km</p>
            <p>Tiempo estimado sin tráfico: {formatTime(optimizedRoute.time)}</p>
          </div>
        )}
        {optimizedRoute.instructions.length > 0 && (
          <div>
            <h3>Instrucciones de Ruta:</h3>
            <div className="mb-2">
              <SpeechSynthesis optimizedRoute={optimizedRoute} />
            </div>
            <ul className="list-group">
              {optimizedRoute.instructions.map((instruction, index) => (
                <li key={index} className="list-group-item">
                  {instruction.text} <br />
                  <small>Distancia: {(instruction.distance / 1000).toFixed(2)} km, Tiempo: {formatTime(instruction.time)}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
        {destinationCoordinates && <Weather latitude={destinationCoordinates.lat} longitude={destinationCoordinates.lng} />}
        <div className="navbar-Resp">
        <Navbar 
        location={destination} 
        onSearch={handleSearch}
        onParkingClick={handleParkingClick}
        showParkingPopups={showParkingPopups}
        />
         <div className="custom-navbar">
        <div className="container-fluid">
    <button className="btn btn-light me-2" onClick={handleParkingClick}>
      <i className='fas fa-parking'></i>Estacionamientos
    </button>
    <button
  className="btn btn-light me-2"
  onClick={handleSearchClick}
>
  <i className="fa fa-train" aria-hidden="true"></i> Rutas en tren
</button>
<button className="btn btn-light me-2"
 onClick={handlePortsClick}>
    <i class="fa-solid fa-ship"></i> Puertos
    </button>
<button className="btn btn-light me-2" onClick={handleClearMap} style={{ backgroundColor: '#38A3D5', color: '#fff' }}><i class="fa fa-refresh"></i></button>
  </div>
  </div>
  </div>
        {businesses.map((business) => (
          <li key={business.id} style={{ marginBottom: '20px', listStyle: 'none' }}>
            <h2>{business.name}</h2>
            <p>{business.location.address1}, {business.location.city}</p>
            <p>{business.rating} estrellas ({business.review_count} reseñas)</p>
            {business.image_url && (
              <img src={business.image_url} alt={business.name} style={{ width: '200px' }} />
            )}
            <p>Precio: {business.price}</p>
            <p>Teléfono: {business.phone}</p>
            <p>Categorías: {business.categories.map(category => category.title).join(', ')}</p>
            <p><a href={business.url} target="_blank" rel="noopener noreferrer">Ver en Yelp</a></p>
          </li>
        ))}
         {selectedPorts.map((port, index) => (
      <li key={index}>
        {port.name} 
      </li>
    ))}
      </div>
      <div className="right-panel">
        <div style={{ height: '100%', width: '100%' }}>
        <TomTomTraffic />
          {currentLocation && (
               <MapComponent
               currentLocation={currentLocation}
               routes={routes}
               ports={ports}
               railways={railways}
               selectedStations={selectedStations}
               handleStationClick={handleStationClick}
               route={route}
               parkingData={parkingData}
               destinationCoordinates={destinationCoordinates}
               optimizedRoute={optimizedRoute}
               businesses={businesses}
               setDestination={setDestination}
               setDestinationCoordinates={setDestinationCoordinates}
               handleOptimizeRoute={handleOptimizeRoute}
               vehicleType={vehicleType}
               handleSetDestination={handleSetDestination}
               handlePortsSelected={handlePortsSelected} 
             />
          )}
          {showWeatherBar && destinationCoordinates && (
            <WeatherBar
              latitude={destinationCoordinates.lat}
              longitude={destinationCoordinates.lng}
            />
          )}
         
        </div>
      </div>
      {selectedBusiness && (
        <div className="business-details">
          <h2>{selectedBusiness.name}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
/*
import React from 'react';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const App = () => {
  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <TileLayer
        url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://www.openseamap.org">OpenSeaMap</a>'
      />
      <WMSTileLayer
        url="https://ows.terrestris.de/osm/service?"
        layers="OSM-WMS"
        format="image/png"
        transparent={true}
        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <WMSTileLayer
        url="https://services.sentinel-hub.com/ogc/wms/"
        layers="sentinel-2-l1c"
        format="image/png"
        transparent={true}
        attribution='Map data: &copy; <a href="https://www.sentinel-hub.com/">Sentinel Hub</a>'
      />
      <WMSTileLayer
        url="https://geo.vliz.be/geoserver/MarineRegions/wms?"
        layers="MarineRegions:eez_boundaries"
        format="image/png"
        transparent={true}
        attribution='Map data: &copy; <a href="https://www.marineregions.org/">MarineRegions</a>'
      />
    </MapContainer>
  );
};

export default App;*/