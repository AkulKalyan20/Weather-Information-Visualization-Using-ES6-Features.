import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ForecastItem, TemperatureUnit } from '../types/weather';
import { convertTemperature } from '../utils/weatherUtils';
import { BarChart3, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeatherChartProps {
  data: ForecastItem[];
  unit: TemperatureUnit;
  theme: 'light' | 'dark';
  className?: string;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ 
  data, 
  unit, 
  theme, 
  className = '' 
}) => {
  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');

  // ES6 useMemo with arrow functions and array methods
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Filter to get one reading per day using ES6 methods
    const dailyData = data
      .filter((_, index) => index % 8 === 0) // Every 8th item (24h intervals)
      .slice(0, 5); // Next 5 days

    // ES6 destructuring and array methods
    const labels = dailyData.map(item => 
      new Date(item.dt * 1000).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    );

    const temperatures = dailyData.map(item => 
      convertTemperature(item.main.temp, 'celsius', unit)
    );

    const humidity = dailyData.map(item => item.main.humidity);
    const windSpeed = dailyData.map(item => item.wind.speed);

    // ES6 template literals and object shorthand
    const isDark = theme === 'dark';
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    return {
      labels,
      datasets: [
        {
          label: `Temperature (°${unit === 'celsius' ? 'C' : 'F'})`,
          data: temperatures,
          borderColor: '#3b82f6',
          backgroundColor: chartType === 'line' 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'rgba(59, 130, 246, 0.8)',
          fill: chartType === 'line',
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'Humidity (%)',
          data: humidity,
          borderColor: '#10b981',
          backgroundColor: chartType === 'line' 
            ? 'rgba(16, 185, 129, 0.1)' 
            : 'rgba(16, 185, 129, 0.8)',
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          yAxisID: 'y1',
        }
      ]
    };
  }, [data, unit, theme, chartType]);

  // ES6 object with computed properties
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        // ES6 arrow function in callback
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}${context.datasetIndex === 0 ? `°${unit === 'celsius' ? 'C' : 'F'}` : '%'}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          // ES6 arrow function
          callback: (value: any) => `${value}°${unit === 'celsius' ? 'C' : 'F'}`
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          callback: (value: any) => `${value}%`
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  }), [theme, unit]);

  if (!chartData) return null;

  // ES6 arrow function event handler
  const toggleChartType = () => {
    setChartType(prev => prev === 'line' ? 'bar' : 'line');
  };

  return (
    <div className={`bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white dark:text-gray-100">
          5-Day Weather Forecast
        </h3>
        <button
          onClick={toggleChartType}
          className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
        >
          {chartType === 'line' ? (
            <BarChart3 className="w-4 h-4 text-white" />
          ) : (
            <TrendingUp className="w-4 h-4 text-white" />
          )}
          <span className="text-sm text-white capitalize">{chartType === 'line' ? 'Bar' : 'Line'}</span>
        </button>
      </div>
      
      <div className="relative h-80">
        {chartType === 'line' ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default WeatherChart;