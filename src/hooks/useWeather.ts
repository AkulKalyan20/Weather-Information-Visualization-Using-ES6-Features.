import { useState, useCallback, useEffect } from 'react';
import { weatherService } from '../services/weatherService';
import { CurrentWeatherResponse, ForecastResponse } from '../types/weather';

interface WeatherData {
  current: CurrentWeatherResponse | null;
  forecast: ForecastResponse | null;
}

interface UseWeatherReturn {
  data: WeatherData;
  loading: boolean;
  error: string | null;
  fetchWeatherByCity: (city: string) => Promise<void>;
  fetchWeatherByLocation: () => Promise<void>;
  clearError: () => void;
}

export const useWeather = (): UseWeatherReturn => {
  const [data, setData] = useState<WeatherData>({
    current: null,
    forecast: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ES6 useCallback with arrow function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ES6 async/await with Promise.all and error handling
  const fetchWeatherByCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // ES6 Promise.all for concurrent requests
      const [current, forecast] = await Promise.all([
        weatherService.getCurrentWeather(city),
        weatherService.getForecast(city)
      ]);
      
      // ES6 object shorthand
      setData({ current, forecast });
    } catch (err) {
      // ES6 instanceof and ternary operator
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ES6 async/await with destructuring
  const fetchWeatherByLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { current, forecast } = await weatherService.getLocationWeather();
      setData({ current, forecast });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ES6 useEffect for cleanup and error recovery
  useEffect(() => {
    // Auto-clear errors after 10 seconds
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    data,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    clearError
  };
};