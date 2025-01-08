import React from 'react';
import getDistance from './helpers/getDistance';
import './styles/SearchBar.css';

const SearchBar = ({
  destination,
  onDestinationChange,
  onSearch,
  vehicleType,
  onVehicleChange,
  suggestions,
  onSuggestionSelect,
  destinationCoordinates,
  currentLocation,
  onOptimizeRoute
}) => {
  const isOutsideContinent = (currentLocation, destinationCoordinates) => {
    const maxDistance = 5000 * 1000; // 5000 km en metros
    return getDistance(currentLocation, destinationCoordinates) > maxDistance;
  };

  const renderDestinationInput = () => (
    <div className="input-group mb-2 position-relative">
      <input
        type="text"
        id="destination"
        className="form-control"
        value={destination}
        onChange={onDestinationChange}
        placeholder="Ingrese el destino"
      />
      <div className="input-group-append">
        <button className="btn btn-primary" onClick={onSearch}>
          <i className='fas fa-search'></i>
        </button>
      </div>
      {/* Agregar el contenedor para las sugerencias dentro del contenedor del input */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list list-group mt-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="list-group-item" onClick={() => onSuggestionSelect(suggestion)}>
              {suggestion.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderVehicleSelector = () => {
    const isValidLocation = !destinationCoordinates || 
                            (currentLocation && destinationCoordinates && !isOutsideContinent(currentLocation, destinationCoordinates));
                            
    return (
      <div className="form-group-inner-item mb-2">
        <p>Medio de transporte:</p>
        <select id="vehicle" className="form-control" value={vehicleType} onChange={onVehicleChange}>
          {isValidLocation && (
            <>
              <option value="car">Automovil</option>
              <option value="bike">Bicicleta</option>
              <option value="foot">Caminar</option>
            </>
          )}
          <option value="airplane">✈️</option>
        </select>
      </div>
    );
  };

  const renderSuggestionsList = () => (
    <div>
      {destinationCoordinates && (
        <button
          onClick={() => onOptimizeRoute(vehicleType)}
          className="btn btn-success mt-2"
        >
          <i className='fas fa-route'></i> Optimizar Ruta
        </button>
      )}
    </div>
  );

  return (
    <div className="search-bar">
      {renderDestinationInput()}
      {renderVehicleSelector()}
      {renderSuggestionsList()}
    </div>
  );
};

export default SearchBar;
