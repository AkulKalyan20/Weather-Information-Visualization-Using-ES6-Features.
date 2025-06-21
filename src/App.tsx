import React, { useEffect } from 'react';
import { Cloud } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import { useSettings } from './hooks/useSettings';
import { getWeatherGradient, isDayTime } from './utils/weatherUtils';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherChart from './components/WeatherChart';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ThemeToggle from './components/ThemeToggle';
import UnitToggle from './components/UnitToggle';

function App() {
  // ES6 destructuring with custom hooks
  const { data, loading, error, fetchWeatherByCity, fetchWeatherByLocation, clearError } = useWeather();
  const { settings, updateUnit, updateTheme } = useSettings();

  // ES6 useEffect with dependency array
  useEffect(() => {
    // Load demo data on initial load
    fetchWeatherByCity('New York');
  }, [fetchWeatherByCity]);

  // ES6 arrow function event handlers
  const handleSearch = async (city: string) => {
    clearError();
    await fetchWeatherByCity(city);
  };

  const handleLocationRequest = async () => {
    clearError();
    await fetchWeatherByLocation();
  };

  const handleRetry = () => {
    clearError();
    // ES6 ternary operator with optional chaining
    const cityName = data.current?.name || 'New York';
    fetchWeatherByCity(cityName);
  };

  // ES6 template literals and conditional logic
  const backgroundGradient = data.current 
    ? getWeatherGradient(
        data.current.weather[0].main,
        isDayTime(data.current.dt, data.current.sys.sunrise, data.current.sys.sunset)
      )
    : 'from-blue-400 via-blue-500 to-blue-600';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} transition-all duration-1000 ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Cloud className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold text-white dark:text-gray-100">WeatherFlow</h1>
          </div>
          <p className="text-white/80 dark:text-gray-300 text-lg">
            Beautiful weather forecasts with interactive charts
          </p>
          
          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <ThemeToggle 
              theme={settings.theme} 
              onThemeChange={updateTheme}
            />
            <UnitToggle 
              unit={settings.unit} 
              onUnitChange={updateUnit}
            />
          </div>
          
          {/* API Key Notice */}
          <div className="mt-4 p-3 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-500/30 max-w-2xl mx-auto">
            <p className="text-yellow-100 text-sm">
              🔑 <strong>Demo Mode:</strong> Using sample data. To get real weather data, 
              get a free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-200">OpenWeatherMap</a> 
              and replace 'demo_key' in weatherService.ts
            </p>
          </div>
        </header>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onLocationRequest={handleLocationRequest}
          loading={loading}
          className="mb-8"
        />

        {/* Content */}
        <div className="space-y-8">
          {loading && <LoadingSpinner />}
          
          {error && (
            <ErrorMessage
              message={error}
              onRetry={handleRetry}
            />
          )}

          {!loading && !error && data.current && (
            <>
              {/* Current Weather */}
              <CurrentWeather 
                data={data.current} 
                unit={settings.unit}
              />

              {/* Weather Chart */}
              {data.forecast && (
                <WeatherChart 
                  data={data.forecast.list} 
                  unit={settings.unit}
                  theme={settings.theme}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-white/60 dark:text-gray-400 text-sm">
          <p>
            Powered by{' '}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/80 dark:hover:text-gray-300 underline"
            >
              OpenWeatherMap
            </a>
            {' '} • Built with modern ES6+ features and React
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;