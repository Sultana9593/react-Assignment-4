import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('Dhaka');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  
  const API_KEY = 'db733ab5e908b8ab6da91e1f30b657f4'; 

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('City not found. Please check the city name!');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      fetchWeather(searchTerm);
      setSearchTerm('');
    }
  };

  // Format Sunrise and Sunset time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      color: '#f9f9f3',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ marginBottom: '20px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
        Weather Dashboard
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '12px 15px',
            width: '260px',
            borderRadius: '8px',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        />
        <button type="submit" style={{
          padding: '12px 20px',
          background: '#60532d',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          Search
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ margin: '40px 0', textAlign: 'center' }}>
          <div style={{
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 10px'
          }}></div>
          <p>Loading weather data...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#585814',
          color: '#white',
          padding: '12px 20px',
          borderRadius: '8px',
          marginTop: '20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}>
          {error}
        </div>
      )}

      {/* Weather Info Display */}
      {weatherData && !loading && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '30px',
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '28px' }}>
            {weatherData.name}, {weatherData.sys.country}
          </h2>

          {/* Weather Icon & Temp */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '15px 0' }}>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="weather-icon"
              style={{ width: '80px', height: '80px' }}
            />
            <span style={{ fontSize: '48px', fontWeight: 'bold' }}>
              {Math.round(weatherData.main.temp)}°C
            </span>
          </div>

          <p style={{ textTransform: 'capitalize', fontSize: '18px', fontStyle: 'italic', marginBottom: '20px' }}>
            {weatherData.weather[0].description}
          </p>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            textAlign: 'left',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '15px',
            borderRadius: '10px'
          }}>
            <div>
              <strong>Humidity:</strong> {weatherData.main.humidity}%
            </div>
            <div>
              <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
            </div>
            <div>
              <strong>Sunrise:</strong> {formatTime(weatherData.sys.sunrise)}
            </div>
            <div>
              <strong>Sunset:</strong> {formatTime(weatherData.sys.sunset)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
