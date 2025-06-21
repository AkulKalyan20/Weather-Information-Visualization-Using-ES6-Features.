import { WeatherData, TemperatureUnit } from '../types/weather';

// ES6 arrow function for weather gradient
export const getWeatherGradient = (weatherMain: string, isDay: boolean = true): string => {
  // ES6 object with computed properties
  const gradients = {
    Clear: isDay 
      ? 'from-blue-400 via-blue-500 to-blue-600' 
      : 'from-purple-900 via-blue-900 to-indigo-900',
    Clouds: isDay 
      ? 'from-gray-400 via-gray-500 to-gray-600' 
      : 'from-gray-800 via-gray-900 to-black',
    Rain: isDay 
      ? 'from-blue-600 via-blue-700 to-blue-800' 
      : 'from-blue-900 via-indigo-900 to-purple-900',
    Drizzle: isDay 
      ? 'from-blue-500 via-blue-600 to-blue-700' 
      : 'from-blue-800 via-indigo-800 to-purple-800',
    Thunderstorm: isDay 
      ? 'from-purple-600 via-purple-700 to-purple-800' 
      : 'from-purple-900 via-indigo-900 to-black',
    Snow: isDay 
      ? 'from-blue-200 via-blue-300 to-blue-400' 
      : 'from-blue-800 via-blue-900 to-indigo-900',
    Mist: isDay 
      ? 'from-gray-300 via-gray-400 to-gray-500' 
      : 'from-gray-700 via-gray-800 to-gray-900',
    Smoke: isDay 
      ? 'from-yellow-600 via-orange-600 to-red-600' 
      : 'from-yellow-800 via-orange-800 to-red-800',
    Haze: isDay 
      ? 'from-yellow-400 via-yellow-500 to-orange-500' 
      : 'from-yellow-700 via-orange-700 to-red-700',
    Dust: isDay 
      ? 'from-yellow-500 via-orange-500 to-red-500' 
      : 'from-yellow-800 via-orange-800 to-red-800',
    Fog: isDay 
      ? 'from-gray-300 via-gray-400 to-gray-500' 
      : 'from-gray-700 via-gray-800 to-gray-900',
    Sand: isDay 
      ? 'from-yellow-600 via-orange-600 to-red-600' 
      : 'from-yellow-800 via-orange-800 to-red-800',
    Ash: isDay 
      ? 'from-gray-500 via-gray-600 to-gray-700' 
      : 'from-gray-800 via-gray-900 to-black',
    Squall: isDay 
      ? 'from-blue-600 via-blue-700 to-purple-700' 
      : 'from-blue-900 via-purple-900 to-indigo-900',
    Tornado: isDay 
      ? 'from-gray-600 via-gray-700 to-gray-800' 
      : 'from-gray-800 via-gray-900 to-black'
  };

  return gradients[weatherMain as keyof typeof gradients] || gradients.Clear;
};

// ES6 arrow function for day/night detection
export const isDayTime = (current: number, sunrise: number, sunset: number): boolean => {
  return current >= sunrise && current <= sunset;
};

// ES6 arrow function with default parameters for temperature conversion
export const convertTemperature = (
  temp: number, 
  from: TemperatureUnit, 
  to: TemperatureUnit
): number => {
  if (from === to) return temp;
  
  // ES6 ternary operator for conversion logic
  return from === 'celsius' 
    ? (temp * 9/5) + 32  // Celsius to Fahrenheit
    : (temp - 32) * 5/9; // Fahrenheit to Celsius
};

// ES6 arrow function with template literals
export const formatTemperature = (temp: number, unit: TemperatureUnit): string => {
  const rounded = Math.round(temp);
  return `${rounded}°${unit === 'celsius' ? 'C' : 'F'}`;
};

// ES6 arrow function for string manipulation
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

// ES6 arrow function with array indexing
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// ES6 arrow function for UV index description
export const getUVIndexDescription = (uvIndex: number): string => {
  // ES6 conditional (ternary) operator chaining
  return uvIndex <= 2 ? 'Low' :
         uvIndex <= 5 ? 'Moderate' :
         uvIndex <= 7 ? 'High' :
         uvIndex <= 10 ? 'Very High' : 'Extreme';
};

// ES6 arrow function for weather condition mapping
export const getWeatherEmoji = (weatherMain: string): string => {
  // ES6 object with string keys
  const emojiMap: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '💨',
    Haze: '🌫️',
    Dust: '💨',
    Fog: '🌫️',
    Sand: '💨',
    Ash: '💨',
    Squall: '💨',
    Tornado: '🌪️'
  };

  return emojiMap[weatherMain] || '🌤️';
};

// ES6 arrow function for time formatting
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ES6 arrow function for data validation
export const isValidWeatherData = (data: any): boolean => {
  return data && 
         data.main && 
         typeof data.main.temp === 'number' &&
         data.weather && 
         Array.isArray(data.weather) && 
         data.weather.length > 0;
};