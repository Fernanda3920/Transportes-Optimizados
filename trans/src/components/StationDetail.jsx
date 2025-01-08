import React from 'react';

const StationDetails = ({ station }) => {
  if (!station) return null;

  return (
    <div>
      <h3>Detalles de la Estación</h3>
      <p>ID: {station.id}</p>
      {station.tags && station.tags.name && <p>Nombre: {station.tags.name}</p>}
      {station.tags && station.tags.railway && <p>Tipo: {station.tags.railway}</p>}
      {station.tags && station.tags.operator && <p>Operador: {station.tags.operator}</p>}
    </div>
  );
};

export default StationDetails;
