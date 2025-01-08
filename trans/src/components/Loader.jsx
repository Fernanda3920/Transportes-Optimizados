import React from 'react';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      <p>Cargando...</p>
    </div>
  );
};

export default Loader;
