import React from 'react';
import { Cloud, Sun, CloudRain, Snowflake } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => {
  // ES6 array with weather icons for animation
  const weatherIcons = [
    { Icon: Sun, color: 'text-yellow-300', delay: '0s' },
    { Icon: Cloud, color: 'text-white', delay: '0.2s' },
    { Icon: CloudRain, color: 'text-blue-300', delay: '0.4s' },
    { Icon: Snowflake, color: 'text-blue-200', delay: '0.6s' }
  ];

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative mb-6">
        {/* Animated weather icons using ES6 map */}
        <div className="relative w-24 h-24">
          {weatherIcons.map(({ Icon, color, delay }, index) => (
            <Icon 
              key={index}
              className={`absolute inset-0 w-24 h-24 ${color} animate-pulse`}
              style={{ 
                animationDelay: delay,
                animationDuration: '2s',
                opacity: 0.7 - (index * 0.15)
              }} 
            />
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white dark:text-gray-100 mb-2">
          Fetching Weather Data
        </h3>
        <p className="text-white/70 dark:text-gray-400">
          Please wait while we get the latest weather information...
        </p>
      </div>
      
      {/* Loading dots with ES6 array generation */}
      <div className="flex space-x-2 mt-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-white/50 dark:bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;