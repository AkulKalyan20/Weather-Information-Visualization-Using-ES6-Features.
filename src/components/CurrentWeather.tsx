import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  MapPin,
  Compass
} from 'lucide-react';
import { CurrentWeatherResponse, TemperatureUnit } from '../types/weather';
import { convertTemperature, getWindDirection } from '../utils/weatherUtils';

interface CurrentWeatherProps {
  data: CurrentWeatherResponse;
  unit: TemperatureUnit;
  className?: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  data, 
  unit, 
  className = '' 
}) => {
  // ES6 arrow functions for utility methods
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // ES6 template literals and object destructuring
  const { main, wind, weather, visibility, sys } = data;
  
  // ES6 array with object shorthand and computed properties
  const metrics = [
    {
      icon: Thermometer,
      label: 'Feels like',
      value: `${Math.round(convertTemperature(main.feels_like, 'celsius', unit))}°${unit === 'celsius' ? 'C' : 'F'}`,
      color: 'text-orange-300'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${main.humidity}%`,
      color: 'text-blue-300'
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${wind.speed} m/s ${getWindDirection(wind.deg)}`,
      color: 'text-gray-300'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${(visibility / 1000).toFixed(1)} km`,
      color: 'text-purple-300'
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${main.pressure} hPa`,
      color: 'text-green-300'
    },
    {
      icon: Compass,
      label: 'Wind Direction',
      value: `${wind.deg}° ${getWindDirection(wind.deg)}`,
      color: 'text-indigo-300'
    }
  ];

  return (
    <div className={`bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-white/70 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-white dark:text-gray-100">
            {data.name}, {sys.country}
          </h2>
        </div>
        <div className="text-sm text-white/70 dark:text-gray-400">
          {/* ES6 template literals with date formatting */}
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main weather display */}
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img
              src={getWeatherIcon(weather[0].icon)}
              alt={weather[0].description}
              className="w-24 h-24 drop-shadow-lg"
            />
          </div>
          <div>
            <div className="text-5xl font-bold text-white dark:text-gray-100 mb-2">
              {Math.round(convertTemperature(main.temp, 'celsius', unit))}°{unit === 'celsius' ? 'C' : 'F'}
            </div>
            <div className="text-white/80 dark:text-gray-300 text-lg capitalize mb-1">
              {weather[0].description}
            </div>
            <div className="text-white/60 dark:text-gray-400 text-sm">
              {Math.round(convertTemperature(main.temp_min, 'celsius', unit))}° / {Math.round(convertTemperature(main.temp_max, 'celsius', unit))}°
            </div>
          </div>
        </div>

        {/* Weather metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* ES6 map with destructuring */}
          {metrics.map(({ icon: Icon, label, value, color }, index) => (
            <div key={index} className="bg-white/5 dark:bg-gray-700/30 rounded-xl p-3 hover:bg-white/10 dark:hover:bg-gray-700/50 transition-colors duration-200">
              <div className="flex items-center space-x-2 mb-1">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-white/70 dark:text-gray-400 text-xs font-medium">
                  {label}
                </span>
              </div>
              <div className="text-white dark:text-gray-100 font-semibold">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sun times */}
      <div className="mt-6 flex items-center justify-center space-x-8 pt-4 border-t border-white/10 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <Sunrise className="w-5 h-5 text-yellow-300" />
          <div>
            <div className="text-white/70 dark:text-gray-400 text-xs">Sunrise</div>
            <div className="text-white dark:text-gray-100 font-medium">
              {formatTime(sys.sunrise)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Sunset className="w-5 h-5 text-orange-300" />
          <div>
            <div className="text-white/70 dark:text-gray-400 text-xs">Sunset</div>
            <div className="text-white dark:text-gray-100 font-medium">
              {formatTime(sys.sunset)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;