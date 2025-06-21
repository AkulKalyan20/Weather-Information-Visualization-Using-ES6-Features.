import { useState, useEffect, useCallback } from 'react';
import { WeatherSettings, TemperatureUnit, Theme } from '../types/weather';

const DEFAULT_SETTINGS: WeatherSettings = {
  unit: 'celsius',
  theme: 'light'
};

export const useSettings = () => {
  const [settings, setSettings] = useState<WeatherSettings>(() => {
    // ES6 try-catch with localStorage
    try {
      const saved = localStorage.getItem('weatherSettings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // ES6 useEffect with dependency array
  useEffect(() => {
    try {
      localStorage.setItem('weatherSettings', JSON.stringify(settings));
      
      // Apply theme to document
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }, [settings]);

  // ES6 useCallback with arrow functions
  const updateUnit = useCallback((unit: TemperatureUnit) => {
    setSettings(prev => ({ ...prev, unit }));
  }, []);

  const updateTheme = useCallback((theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateUnit,
    updateTheme,
    resetSettings
  };
};