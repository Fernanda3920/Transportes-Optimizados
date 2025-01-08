import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/TrafficControl.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TomTomTraffic = () => {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  const apiKey = 'api_key';

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation(`${latitude},${longitude}`);
          },
          (error) => {
            console.error('Error getting user location:', error);
            setError('Error getting user location');
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser');
        setError('Geolocation is not supported by this browser');
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchTrafficData = async () => {
      if (!userLocation) {
        setError('User location not available');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${userLocation}&key=${apiKey}`
        );
        setTrafficData(response.data);
      } catch (err) {
        setError('Error fetching traffic data');
      } finally {
        setLoading(false);
      }
    };

    fetchTrafficData();
  }, [userLocation, apiKey]);

  const renderTrafficInfo = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!trafficData) return null;

    const { flowSegmentData } = trafficData;
    const { currentSpeed, freeFlowSpeed, currentTravelTime, freeFlowTravelTime, roadClosure } = flowSegmentData;

    // Función para convertir segundos a minutos si es necesario
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return minutes > 0 ? `${minutes} minuto(s) y ${remainingSeconds} segundo(s)` : `${seconds} segundo(s)`;
    };

    return (
      <div className={`traffic-alert ${showAlert ? 'show' : 'hide'}`}>
        <div className="alert-header">
          <div className='car-icon'>
            <i className="fa-solid fa-car"></i>
          </div>
          <p className="alert-title">Estado actual del tráfico en tu zona</p>
          <button className="close-alert" onClick={() => setShowAlert(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="alert-details">
          <p>Velocidad actual: {currentSpeed} km/h</p>
          <p>Velocidad de flujo libre: {freeFlowSpeed} km/h</p>
          <p>Tiempo de viaje actual: {formatTime(currentTravelTime)} </p>
          <p>Tiempo de viaje en flujo libre: {formatTime(freeFlowTravelTime)} </p>
          {roadClosure && <p className="road-closure">Carretera cerrada</p>}
          {!roadClosure && (
            <p className="traffic-status">
              El tráfico está {currentSpeed <= freeFlowSpeed ? 'fluyendo normalmente' : 'fluyendo más lento de lo habitual'}.{' '}
              {currentSpeed <= freeFlowSpeed ? (
                <span role="img" aria-label="smiley">
                  🙂
                </span>
              ) : (
                <span role="img" aria-label="sad">
                  😕
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderTrafficInfo()}
    </div>
  );
};

export default TomTomTraffic;
