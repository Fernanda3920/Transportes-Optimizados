import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({
  currentLocation,
  routes,
  ports,
  railways,
  selectedStations,
  handleStationClick,
  route,
  parkingData,
  destinationCoordinates,
  optimizedRoute,
  businesses,
  handleSetDestination,
  handlePortsSelected
}) => {

  
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {currentLocation && (
        <MapContainer
          center={currentLocation}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {routes.map((route, index) => (
            <Polyline key={index} positions={route.coordinates} color="blue" />
          ))}
          {optimizedRoute && optimizedRoute.points && (
            <Polyline positions={optimizedRoute.points} color="blue" />
          )}
         {ports.map((port, index) => (
          <Marker key={index} position={port.position}>
            <Popup>
              {port.name} - {port.country}<br />
              <button onClick={() => handlePortsSelected(port.position.lat, port.position.lng, port.name)}>Seleccionar</button>
            </Popup>
          </Marker>
        ))}
          {railways.map((element, index) => (
            selectedStations.includes(element) ? (
              <Popup
                key={`popup-${index}`}
                position={[parseFloat(element.lat), parseFloat(element.lon)]}
                closeButton={false}
                autoClose={false}
                onClose={() => handleStationClick(element)}
              >
                <div>
                  <p>ID: {element.id}</p>
                  {element.tags?.name && <p>Nombre: {element.tags.name}</p>}
                  {element.tags?.railway && <p>Tipo: {element.tags.railway}</p>}
                  {element.tags?.operator && <p>Operador: {element.tags.operator}</p>}
                </div>
              </Popup>
            ) : (
              <CircleMarker
                key={`marker-${index}`}
                center={[parseFloat(element.lat), parseFloat(element.lon)]}
                radius={5}
                eventHandlers={{ click: () => handleStationClick(element) }}
              >
                <Popup>
                  <div>
                    <p>ID: {element.id}</p>
                    {element.tags?.name && <p>Nombre: {element.tags.name}</p>}
                    {element.tags?.railway && <p>Tipo: {element.tags.railway}</p>}
                    {element.tags?.operator && <p>Operador: {element.tags.operator}</p>}
                  </div>
                </Popup>
              </CircleMarker>
            )
          ))}
          {route && (
            <Polyline positions={route} color="salmon" />
          )}
          {parkingData.map(parking => (
            <Marker key={parking.id} position={[parking.lat, parking.lon]}>
              <Popup>
                {parking.name}<br />
                ID: {parking.id}<br />
                {parking.details && Object.entries(parking.details).map(([key, value]) => (
                  <div key={key}>{key}: {value}</div>
                ))}
                <button onClick={() => handleSetDestination(parking.lat, parking.lon, parking.name)}>Establecer destino</button>
              </Popup>
            </Marker>
          ))}
          {currentLocation && (
            <Marker position={currentLocation}>
              <Popup>Tu ubicación actual</Popup>
            </Marker>
          )}
          {destinationCoordinates && (
            <>
              <Marker position={destinationCoordinates}>
                <Popup>Lugar seleccionado</Popup>
              </Marker>
              {optimizedRoute && optimizedRoute.points && (
                <Polyline positions={optimizedRoute.points} color="blue" />
              )}
            </>
          )}
          {businesses.map(business => (
            <Marker key={business.id} position={[business.coordinates.latitude, business.coordinates.longitude]}>
              <Popup>
                <div>
                  <h3>{business.name}</h3>
                  <p>{business.location.address1}, {business.location.city}</p>
                  <button onClick={() => handleSetDestination(business.coordinates.latitude, business.coordinates.longitude, business.name)}>Establecer destino</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapComponent;
