import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, MapPin, RefreshCw } from 'lucide-react';

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  humidity: number;
  wind: number;
  high: number;
  low: number;
  forecast: { day: string; high: number; low: number; condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' }[];
}

const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Simulated weather data for Tampere, Finland
  const fetchWeather = () => {
    setLoading(true);
    setTimeout(() => {
      const conditions: WeatherData['condition'][] = ['cloudy', 'rainy', 'snowy', 'cloudy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

      setWeather({
        city: 'Tampere',
        country: 'Finland',
        temp: Math.floor(Math.random() * 15) - 5,
        feelsLike: Math.floor(Math.random() * 15) - 7,
        condition: randomCondition,
        humidity: Math.floor(Math.random() * 30) + 60,
        wind: Math.floor(Math.random() * 15) + 5,
        high: Math.floor(Math.random() * 5) + 2,
        low: Math.floor(Math.random() * 5) - 5,
        forecast: [
          { day: 'Mon', high: 3, low: -2, condition: 'cloudy' },
          { day: 'Tue', high: 1, low: -4, condition: 'snowy' },
          { day: 'Wed', high: 4, low: -1, condition: 'rainy' },
          { day: 'Thu', high: 5, low: 0, condition: 'cloudy' },
          { day: 'Fri', high: 2, low: -3, condition: 'snowy' },
        ],
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string, size: 'sm' | 'lg' = 'lg') => {
    const iconClass = size === 'lg' ? 'w-24 h-24' : 'w-8 h-8';
    switch (condition) {
      case 'sunny':
        return <Sun className={`${iconClass} text-yellow-400`} />;
      case 'cloudy':
        return <Cloud className={`${iconClass} text-gray-400`} />;
      case 'rainy':
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case 'snowy':
        return <CloudSnow className={`${iconClass} text-blue-200`} />;
      default:
        return <Cloud className={`${iconClass} text-gray-400`} />;
    }
  };

  const getBackground = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
      case 'cloudy':
        return 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700';
      case 'rainy':
        return 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800';
      case 'snowy':
        return 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500';
      default:
        return 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className={`h-full ${getBackground(weather.condition)} text-white overflow-auto`}>
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white/70" />
            <div>
              <h2 className="text-xl font-medium">{weather.city}</h2>
              <p className="text-white/60 text-sm">{weather.country}</p>
            </div>
          </div>
          <button onClick={fetchWeather} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-6 py-8 text-center">
        <div className="flex justify-center mb-4">
          {getWeatherIcon(weather.condition)}
        </div>
        <div className="text-7xl font-light mb-2">{weather.temp}°</div>
        <p className="text-xl text-white/80 capitalize mb-2">{weather.condition}</p>
        <p className="text-white/60">H:{weather.high}° L:{weather.low}°</p>
      </div>

      <div className="px-6 py-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Thermometer className="w-6 h-6 mx-auto mb-1 text-white/70" />
              <p className="text-sm text-white/60">Feels like</p>
              <p className="text-lg font-medium">{weather.feelsLike}°</p>
            </div>
            <div>
              <Droplets className="w-6 h-6 mx-auto mb-1 text-white/70" />
              <p className="text-sm text-white/60">Humidity</p>
              <p className="text-lg font-medium">{weather.humidity}%</p>
            </div>
            <div>
              <Wind className="w-6 h-6 mx-auto mb-1 text-white/70" />
              <p className="text-sm text-white/60">Wind</p>
              <p className="text-lg font-medium">{weather.wind} km/h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-sm text-white/60 mb-3 uppercase tracking-wide">5-Day Forecast</h3>
          <div className="space-y-3">
            {weather.forecast.map((day, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="w-12 text-white/80">{day.day}</span>
                <div className="flex-1 flex justify-center">
                  {getWeatherIcon(day.condition, 'sm')}
                </div>
                <div className="flex gap-3 text-right">
                  <span className="w-8">{day.high}°</span>
                  <span className="w-8 text-white/50">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-2 text-center">
        <p className="text-xs text-white/40">Simulated weather data for Tampere, Finland</p>
      </div>
    </div>
  );
};

export default Weather;
