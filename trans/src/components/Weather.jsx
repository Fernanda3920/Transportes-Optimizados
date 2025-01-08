import React, { useState, useEffect } from 'react';
import './styles/Weather.css'; 

const WeatherBar = ({ latitude, longitude }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = 'api_key';
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Error al obtener el clima. Código de error: ' + response.status);
        }

        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  const handleClose = () => {
    setWeather(null);
  };

  if (!weather) {
    return null;
  }

  return (
    <div className="weather-bar">
      <div className="weather-info">
        <span className="weather-icon"><img src={weather.icon} alt={weather.description} /></span>
        <span className="weather-temperature">{weather.temperature}°C</span>
        <span className="weather-description">{weather.description}</span>
        <button className="close-btn" onClick={handleClose}>X</button>
      </div>
    </div>
  );
};

export default WeatherBar;
