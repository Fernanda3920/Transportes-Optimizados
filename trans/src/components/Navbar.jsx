import React, { useState } from 'react';
import axios from 'axios';
import './styles/Navbar.css';

const apiKey = 'api_key';

const Navbar = ({ location, onSearch }) => {
  const [term, setTerm] = useState('restaurants');
  const [businesses, setBusinesses] = useState([]);
  
  const fetchBusinesses = async (searchTerm) => {
    try {
      const response = await axios.get('/api/businesses/search', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        params: {
          term: searchTerm,
          location: location,
          limit: 3,
        },
      });
      setBusinesses(response.data.businesses);
      if (onSearch) {
        onSearch(response.data); // Llama a la función onSearch pasando los datos recibidos
      }
    } catch (error) {
      console.error('Error fetching data from Yelp API', error);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!location) {
      alert('Por favor, busque un destino primero.');
      return;
    }
    setTerm(searchTerm);
    fetchBusinesses(searchTerm);
  };



  return (
    <div>
      <div className="custom-navbar">
        <div className="container-fluid">
          <button className="btn btn-light me-2" onClick={() => handleSearch('restaurants')}>
            <i className="fas fa-utensils"></i> Restaurantes
          </button>
          <button className="btn btn-light me-2" onClick={() => handleSearch('hotels')}>
            <i className="fas fa-hotel"></i> Hoteles
          </button>
          <button className="btn btn-light me-2" onClick={() => handleSearch('Tourist places')}>
            <i className="fas fa-map-marker-alt"></i> Lugares turísticos
          </button>
          <button className="btn btn-light me-2" >
      <i className='fas fa-parking'></i> Estacionamientos
    </button>
    <button className="btn btn-light me-2" style={{ backgroundColor: '#3CBCE5', color: '#fff' }}>
      <i class="fa fa-train" aria-hidden="true"></i>Rutas en tren
    </button>
    <button className="btn btn-light me-2" style={{ backgroundColor: '#3CBCE5', color: '#fff' }}>
    <i class="fa-solid fa-ship"></i> Puertos
    </button>
    
    <button className="btn btn-light me-2" ><i class="fa fa-refresh" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
