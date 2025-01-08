import React from 'react';

const Ports = ({ showPorts, setPortLimit, portLimit, fetchAllPorts, setFetchAllPorts, fetchPorts }) => {
  return (
    <>
      {showPorts && (
        <div>
          <h3>Lista de Puertos</h3>
          <select onChange={(e) => setPortLimit(Number(e.target.value))} value={portLimit}>
            <option value={50}>50 puertos</option>
            <option value={100}>100 puertos</option>
            <option value={150}>150 puertos</option>
            <option value={200}>200 puertos</option>
            <option value={400}>Todos los disponibles</option>
          </select>
          <button onClick={() => {
            setFetchAllPorts(portLimit === 'all');
            fetchPorts();
          }}>
            Cargar Puertos
          </button>
        </div>
      )}
    </>
  );
};

export default Ports;
