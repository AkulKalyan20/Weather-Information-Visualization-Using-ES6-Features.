import React, { useState, useCallback } from 'react';
import { Search, MapPin, Loader, History } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationRequest: () => void;
  loading: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onLocationRequest, 
  loading, 
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    // ES6 arrow function with try-catch for localStorage
    try {
      const saved = localStorage.getItem('weatherSearchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  // ES6 useCallback with arrow function
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const cityName = query.trim();
      onSearch(cityName);
      
      // Update search history using ES6 features
      setSearchHistory(prev => {
        const updated = [cityName, ...prev.filter(city => city !== cityName)].slice(0, 5);
        // ES6 try-catch with localStorage
        try {
          localStorage.setItem('weatherSearchHistory', JSON.stringify(updated));
        } catch (error) {
          console.warn('Failed to save search history:', error);
        }
        return updated;
      });
      
      setQuery('');
      setShowHistory(false);
    }
  }, [query, onSearch]);

  // ES6 arrow function for history selection
  const selectFromHistory = (city: string) => {
    setQuery(city);
    setShowHistory(false);
    onSearch(city);
  };

  // ES6 arrow function for clearing history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('weatherSearchHistory');
    setShowHistory(false);
  };

  return (
    <div className={`bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 dark:text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(searchHistory.length > 0)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            placeholder="Enter city name (e.g., London, Tokyo, New York)"
            className="w-full pl-12 pr-4 py-3 bg-white/10 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600 rounded-xl text-white dark:text-gray-100 placeholder-white/50 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
          
          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-600 shadow-lg z-10">
              <div className="flex items-center justify-between p-3 border-b border-white/20 dark:border-gray-600">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Searches</span>
                </div>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Clear
                </button>
              </div>
              {/* ES6 map with arrow function */}
              {searchHistory.map((city, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectFromHistory(city)}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center min-w-[100px]"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
          
          <button
            type="button"
            onClick={onLocationRequest}
            disabled={loading}
            className="px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center"
            title="Use my location"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;