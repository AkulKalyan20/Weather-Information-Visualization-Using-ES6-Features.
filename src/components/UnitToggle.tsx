import React from 'react';
import { Thermometer } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
  className?: string;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ 
  unit, 
  onUnitChange, 
  className = '' 
}) => {
  // ES6 arrow function for unit toggle
  const toggleUnit = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    onUnitChange(newUnit);
  };

  return (
    <button
      onClick={toggleUnit}
      className={`flex items-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 backdrop-blur-md rounded-xl transition-all duration-200 ${className}`}
      title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
    >
      <Thermometer className="w-5 h-5 text-white dark:text-gray-300" />
      <span className="text-white dark:text-gray-300 font-medium">
        °{unit === 'celsius' ? 'C' : 'F'}
      </span>
    </button>
  );
};

export default UnitToggle;