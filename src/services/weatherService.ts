import { CurrentWeatherResponse, ForecastResponse } from '../types/weather';

const API_KEY = 'demo_key'; // Users will need to replace with their own API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Demo data generator using ES6 features
const generateDemoData = () => {
  // Using arrow functions and template literals
  const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'];
  const weatherTypes = ['Clear', 'Clouds', 'Rain', 'Snow'];
  
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
  // ES6 object shorthand and computed properties
  const demoCurrentWeather: CurrentWeatherResponse = {
    coord: { lat: 40.7128, lon: -74.0060 },
    weather: [{ 
      id: 800, 
      main: randomWeather, 
      description: `${randomWeather.toLowerCase()} sky`, 
      icon: '01d' 
    }],
    base: 'stations',
    main: {
      temp: 22.5 + (Math.random() - 0.5) * 20,
      feels_like: 24.2 + (Math.random() - 0.5) * 15,
      temp_min: 20.1 + (Math.random() - 0.5) * 10,
      temp_max: 25.3 + (Math.random() - 0.5) * 10,
      pressure: 1013 + (Math.random() - 0.5) * 50,
      humidity: 65 + (Math.random() - 0.5) * 40
    },
    visibility: 10000,
    wind: { speed: 3.2 + Math.random() * 5, deg: Math.random() * 360 },
    clouds: { all: Math.random() * 100 },
    dt: Date.now() / 1000,
    sys: { 
      country: 'US', 
      sunrise: Date.now() / 1000 - 3600, 
      sunset: Date.now() / 1000 + 3600 
    },
    timezone: -18000,
    id: 5128581,
    name: randomCity,
    cod: 200
  };

  // Using array methods with arrow functions for forecast generation
  const demoForecast: ForecastResponse = {
    cod: '200',
    message: 0,
    cnt: 40,
    list: Array.from({ length: 40 }, (_, i) => ({
      dt: Date.now() / 1000 + (i * 3 * 3600),
      main: {
        temp: 22.5 + Math.sin(i * 0.5) * 8 + (Math.random() - 0.5) * 4,
        feels_like: 24.2 + Math.sin(i * 0.5) * 6,
        temp_min: 18.1 + Math.sin(i * 0.5) * 6,
        temp_max: 27.3 + Math.sin(i * 0.5) * 10,
        pressure: 1013 + (Math.random() - 0.5) * 20,
        humidity: 65 + (Math.random() - 0.5) * 30
      },
      weather: [{ 
        id: 800, 
        main: i % 8 === 0 ? 'Rain' : i % 6 === 0 ? 'Clouds' : 'Clear', 
        description: i % 8 === 0 ? 'light rain' : i % 6 === 0 ? 'few clouds' : 'clear sky', 
        icon: i % 8 === 0 ? '10d' : i % 6 === 0 ? '02d' : '01d' 
      }],
      clouds: { all: Math.random() * 100 },
      wind: { speed: 2 + Math.random() * 8, deg: Math.random() * 360 },
      visibility: 10000,
      pop: i % 8 === 0 ? 0.8 : Math.random() * 0.3,
      dt_txt: new Date(Date.now() + (i * 3 * 3600 * 1000)).toISOString()
    })),
    city: {
      id: 5128581,
      name: randomCity,
      coord: { lat: 40.7128, lon: -74.0060 },
      country: 'US',
      population: 8175133,
      timezone: -18000,
      sunrise: Date.now() / 1000 - 3600,
      sunset: Date.now() / 1000 + 3600
    }
  };

  return { demoCurrentWeather, demoForecast };
};

class WeatherService {
  // ES6 private field syntax
  #apiKey = API_KEY;
  #baseUrl = BASE_URL;

  // Arrow function method with async/await
  private makeRequest = async <T>(endpoint: string): Promise<T> => {
    if (this.#apiKey === 'demo_key') {
      // Simulate network delay with Promise
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const { demoCurrentWeather, demoForecast } = generateDemoData();
      
      if (endpoint.includes('weather?')) {
        return demoCurrentWeather as T;
      } else if (endpoint.includes('forecast?')) {
        return demoForecast as T;
      }
    }

    try {
      const response = await fetch(`${this.#baseUrl}/${endpoint}&appid=${this.#apiKey}&units=metric`);
      
      if (!response.ok) {
        // ES6 template literals for error messages
        throw new Error(`Weather API Error: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Weather service error:', error);
      throw new Error('Failed to fetch weather data. Please check your internet connection.');
    }
  };

  // Arrow function methods
  getCurrentWeather = async (city: string): Promise<CurrentWeatherResponse> => {
    return this.makeRequest<CurrentWeatherResponse>(`weather?q=${encodeURIComponent(city)}`);
  };

  getCurrentWeatherByCoords = async (lat: number, lon: number): Promise<CurrentWeatherResponse> => {
    return this.makeRequest<CurrentWeatherResponse>(`weather?lat=${lat}&lon=${lon}`);
  };

  getForecast = async (city: string): Promise<ForecastResponse> => {
    return this.makeRequest<ForecastResponse>(`forecast?q=${encodeURIComponent(city)}`);
  };

  getForecastByCoords = async (lat: number, lon: number): Promise<ForecastResponse> => {
    return this.makeRequest<ForecastResponse>(`forecast?lat=${lat}&lon=${lon}`);
  };

  // ES6 geolocation with Promise wrapper
  getLocationWeather = async (): Promise<{ current: CurrentWeatherResponse; forecast: ForecastResponse }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // ES6 destructuring
            const { latitude, longitude } = position.coords;
            
            // Promise.all for concurrent requests
            const [current, forecast] = await Promise.all([
              this.getCurrentWeatherByCoords(latitude, longitude),
              this.getForecastByCoords(latitude, longitude)
            ]);
            
            resolve({ current, forecast });
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          // ES6 template literals for error handling
          const errorMessages = {
            1: 'Location access denied by user',
            2: 'Location information unavailable',
            3: 'Location request timeout'
          };
          
          const message = errorMessages[error.code as keyof typeof errorMessages] || 'Unable to retrieve your location';
          reject(new Error(message));
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };
}

export const weatherService = new WeatherService();