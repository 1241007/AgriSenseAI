import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  ChevronDown,
  ArrowLeft,
  MapPin,
  Droplets,
  Wind,
  Eye,
  Thermometer,
  Sun,
  Cloud,
  CloudDrizzle,
  AlertTriangle,
  Sunrise,
  Sunset,
  Gauge,
  Navigation,
  Zap,
  Umbrella,
  CloudRain,
  Wheat,
  Loader2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api, FarmResponse, WeatherResponse } from '../api/client';

export default function Weather() {
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const data = await api.getFarms();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarmId(data[0].farm_id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load farms');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFarmId) {
      fetchWeather(selectedFarmId);
    }
  }, [selectedFarmId]);

  const fetchWeather = async (farmId: string) => {
    setWeatherLoading(true);
    try {
      const data = await api.getWeather({ farm_id: farmId });
      setWeatherData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setWeatherLoading(false);
      setLoading(false);
    }
  };

  const getConditionIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return Sun;
    if (c.includes('rain') || c.includes('drizzle')) return CloudRain;
    if (c.includes('cloud')) return Cloud;
    if (c.includes('storm')) return Zap;
    return Cloud;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
      </div>
    );
  }

  const selectedFarm = farms.find(f => f.farm_id === selectedFarmId);

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-lg bg-white/80 border border-cyan-100 rounded-2xl px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-white/70 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
            >
              {farms.length === 0 && <option value="">No farms found</option>}
              {farms.map(farm => (
                <option key={farm.farm_id} value={farm.farm_id}>{farm.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <CloudRain className="w-8 h-8 text-cyan-600" />
                Weather Intelligence
              </h1>
              <p className="text-gray-600 mt-1">Advanced climate monitoring for {selectedFarm?.name || 'your farm'}</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}

          {weatherLoading && !weatherData && (
            <div className="p-20 flex flex-col items-center justify-center text-cyan-600 gap-4">
              <Loader2 className="w-12 h-12 animate-spin" />
              <p className="font-medium text-lg">Fetching latest forecast...</p>
            </div>
          )}

          {weatherData && (
            <>
              <div className="backdrop-blur-lg bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 text-cyan-100 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedFarm?.region || 'Unknown Region'} ({weatherData.latitude}, {weatherData.longitude})</span>
                    </div>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-inner">
                        {(() => {
                          const Icon = getConditionIcon(weatherData.summary);
                          return <Icon className="w-16 h-16" />;
                        })()}
                      </div>
                      <div>
                        <div className="text-7xl font-bold">{Math.round(weatherData.current_temp || 0)}°C</div>
                        <div className="text-xl text-cyan-100 mt-2 capitalize">{weatherData.summary}</div>
                      </div>
                    </div>
                    <div className="text-cyan-100">Feels like {Math.round((weatherData.current_temp || 0) + 2)}°C • Real-time AI Summary</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Droplets, label: 'Precipitation', value: `${weatherData.forecast[0].precipitation} mm` },
                      { icon: Thermometer, label: 'Max / Min', value: `${weatherData.forecast[0].temp_max}° / ${weatherData.forecast[0].temp_min}°` },
                      { icon: Wind, label: 'Forecast', value: weatherData.forecast[0].condition },
                      { icon: Sun, label: 'UV Index', value: 'Moderate' },
                    ].map((stat, index) => (
                      <div key={index} className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <stat.icon className="w-5 h-5 text-cyan-200" />
                          <span className="text-cyan-100 text-sm">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {weatherData.agricultural_advisory && (
                <div className="backdrop-blur-lg bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl h-fit">
                      <Zap className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-emerald-900 mb-2">AI Agricultural Advisory</h3>
                      <div className="text-emerald-800 whitespace-pre-line leading-relaxed">
                        {weatherData.agricultural_advisory}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6">7-Day Forecast</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {weatherData.forecast.map((day, index) => {
                    const Icon = getConditionIcon(day.condition);
                    const dateObj = new Date(day.date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    return (
                      <div
                        key={index}
                        className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-cyan-100 hover:shadow-lg transition-all text-center group"
                      >
                        <div className="font-medium text-gray-800 mb-3">{dayName}</div>
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-1">{Math.round(day.temp_max)}°</div>
                        <div className="text-xs text-gray-600 mb-3 capitalize">{day.condition}</div>
                        <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                          <Droplets className="w-3 h-3" />
                          <span>{day.precipitation}mm</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Temperature Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={weatherData.forecast}>
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                        stroke="#6b7280" 
                      />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        labelFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #cffafe',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="temp_max"
                        name="Max Temp"
                        stroke="#0891b2"
                        strokeWidth={3}
                        fill="url(#tempGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="temp_min"
                        name="Min Temp"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        fill="transparent"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Expected Precipitation (mm)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weatherData.forecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                        stroke="#6b7280" 
                      />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        labelFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #cffafe',
                          borderRadius: '12px'
                        }}
                      />
                      <Bar dataKey="precipitation" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {!weatherLoading && !weatherData && !error && farms.length > 0 && (
            <div className="text-center p-20 bg-white/40 rounded-3xl border border-cyan-100">
              <CloudRain className="w-16 h-16 text-cyan-200 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">No Weather Data</h2>
              <p className="text-gray-600">Select a farm to view detailed weather intelligence.</p>
            </div>
          )}

          {!loading && farms.length === 0 && (
            <div className="text-center p-20 bg-white/40 rounded-3xl border border-cyan-100">
              <Wheat className="w-16 h-16 text-cyan-200 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">No Farms Registered</h2>
              <p className="text-gray-600 mb-6">You need to register a farm first to get localized weather intelligence.</p>
              <Link 
                to="/farms" 
                className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors shadow-lg"
              >
                Register Your First Farm
              </Link>
            </div>
          )}
    </div>
  );
}
