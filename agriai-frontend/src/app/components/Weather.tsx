import { useState } from 'react';
import { Link } from 'react-router';
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Menu,
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
  Wheat
} from 'lucide-react';
import Sidebar from './Sidebar';
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

const weekForecast = [
  { day: 'Mon', temp: 24, condition: 'Sunny', icon: Sun, rain: 10, humidity: 65, wind: 12 },
  { day: 'Tue', temp: 26, condition: 'Partly Cloudy', icon: Cloud, rain: 20, humidity: 68, wind: 15 },
  { day: 'Wed', temp: 22, condition: 'Rainy', icon: CloudRain, rain: 80, humidity: 85, wind: 18 },
  { day: 'Thu', temp: 23, condition: 'Light Rain', icon: CloudDrizzle, rain: 60, humidity: 78, wind: 14 },
  { day: 'Fri', temp: 25, condition: 'Sunny', icon: Sun, rain: 5, humidity: 62, wind: 10 },
  { day: 'Sat', temp: 27, condition: 'Sunny', icon: Sun, rain: 0, humidity: 58, wind: 8 },
  { day: 'Sun', temp: 28, condition: 'Partly Cloudy', icon: Cloud, rain: 15, humidity: 60, wind: 11 }
];

const rainfallData = [
  { time: '00:00', rainfall: 0 },
  { time: '03:00', rainfall: 2 },
  { time: '06:00', rainfall: 5 },
  { time: '09:00', rainfall: 8 },
  { time: '12:00', rainfall: 12 },
  { time: '15:00', rainfall: 15 },
  { time: '18:00', rainfall: 10 },
  { time: '21:00', rainfall: 5 }
];

const temperatureData = [
  { hour: '12 AM', temp: 18 },
  { hour: '3 AM', temp: 16 },
  { hour: '6 AM', temp: 15 },
  { hour: '9 AM', temp: 20 },
  { hour: '12 PM', temp: 24 },
  { hour: '3 PM', temp: 26 },
  { hour: '6 PM', temp: 23 },
  { hour: '9 PM', temp: 20 }
];

const humidityData = [
  { day: 'Mon', humidity: 65 },
  { day: 'Tue', humidity: 68 },
  { day: 'Wed', humidity: 85 },
  { day: 'Thu', humidity: 78 },
  { day: 'Fri', humidity: 62 },
  { day: 'Sat', humidity: 58 },
  { day: 'Sun', humidity: 60 }
];

export default function Weather() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Weather"
        colorScheme="cyan"
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 backdrop-blur-lg bg-white/80 border-b border-cyan-100">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-cyan-50 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search location..."
                    className="w-full pl-10 pr-4 py-2 bg-white/70 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-cyan-50 rounded-lg transition-colors">
                  <Bell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 px-4 py-2 backdrop-blur-lg bg-white/60 rounded-lg border border-cyan-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-800">John Farmer</div>
                    <div className="text-xs text-gray-600">Premium Plan</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
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
              <p className="text-gray-600 mt-1">Advanced climate monitoring for smart agriculture</p>
            </div>
          </div>

          {/* Current Weather */}
          <div className="backdrop-blur-lg bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Main Info */}
              <div>
                <div className="flex items-center gap-2 text-cyan-100 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>Green Valley Farm, Iowa</span>
                </div>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                    <Sun className="w-16 h-16" />
                  </div>
                  <div>
                    <div className="text-7xl font-bold">24°C</div>
                    <div className="text-xl text-cyan-100 mt-2">Partly Cloudy</div>
                  </div>
                </div>
                <div className="text-cyan-100">Feels like 26°C • Updated 5 mins ago</div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Droplets, label: 'Humidity', value: '65%' },
                  { icon: Wind, label: 'Wind Speed', value: '12 km/h' },
                  { icon: Eye, label: 'Visibility', value: '10 km' },
                  { icon: Gauge, label: 'Pressure', value: '1013 mb' },
                  { icon: Sunrise, label: 'Sunrise', value: '6:24 AM' },
                  { icon: Sunset, label: 'Sunset', value: '7:45 PM' }
                ].map((stat, index) => (
                  <div key={index} className="backdrop-blur-lg bg-white/10 rounded-xl p-4">
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

          {/* Severe Weather Alerts */}
          <div className="backdrop-blur-lg bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="p-3 bg-amber-100 rounded-xl h-fit">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-2">Heavy Rainfall Alert</h3>
                <p className="text-amber-800 mb-3">
                  Moderate to heavy rainfall expected on Wednesday (15-25mm). Consider postponing irrigation
                  and ensure proper drainage in low-lying areas.
                </p>
                <div className="flex items-center gap-4 text-sm text-amber-700">
                  <span>Valid: Next 48 hours</span>
                  <span>•</span>
                  <span>Severity: Moderate</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">7-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {weekForecast.map((day, index) => (
                <div
                  key={index}
                  className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-cyan-100 hover:shadow-lg transition-all text-center"
                >
                  <div className="font-medium text-gray-800 mb-3">{day.day}</div>
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <day.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{day.temp}°</div>
                  <div className="text-xs text-gray-600 mb-3">{day.condition}</div>
                  <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                    <Droplets className="w-3 h-3" />
                    <span>{day.rain}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Temperature Trend */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">24-Hour Temperature</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={temperatureData}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #cffafe',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#0891b2"
                    strokeWidth={3}
                    fill="url(#tempGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Rainfall Chart */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Expected Rainfall (mm)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={rainfallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #cffafe',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="rainfall" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Wind & Humidity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Wind Speed */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Wind Speed (km/h)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weekForecast}>
                  <defs>
                    <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #cffafe',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="wind"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    fill="url(#windGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Humidity */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Humidity (%)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={humidityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #cffafe',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="humidity" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Agricultural Advisory */}
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Agricultural Advisory</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Umbrella,
                  title: 'Irrigation Advisory',
                  type: 'success',
                  message: 'Reduce irrigation by 40% this week due to expected rainfall. Current soil moisture is optimal.',
                  action: 'Recommended'
                },
                {
                  icon: Zap,
                  title: 'Field Operations',
                  type: 'warning',
                  message: 'Postpone fertilizer application to Thursday-Friday. Wednesday rain may cause nutrient runoff.',
                  action: 'Important'
                },
                {
                  icon: Wheat,
                  title: 'Crop Protection',
                  type: 'info',
                  message: 'Apply fungicide before rain on Wednesday. Wet conditions may increase disease risk in wheat.',
                  action: 'Preventive'
                },
                {
                  icon: Wind,
                  title: 'Wind Alert',
                  type: 'info',
                  message: 'Light to moderate winds expected. Safe for spraying operations. Avoid Saturday morning.',
                  action: 'Monitor'
                }
              ].map((advisory, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-xl border ${
                    advisory.type === 'success'
                      ? 'bg-green-50 border-green-200'
                      : advisory.type === 'warning'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        advisory.type === 'success'
                          ? 'bg-green-100'
                          : advisory.type === 'warning'
                          ? 'bg-amber-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <advisory.icon
                        className={`w-5 h-5 ${
                          advisory.type === 'success'
                            ? 'text-green-600'
                            : advisory.type === 'warning'
                            ? 'text-amber-600'
                            : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className={`font-bold ${
                            advisory.type === 'success'
                              ? 'text-green-900'
                              : advisory.type === 'warning'
                              ? 'text-amber-900'
                              : 'text-blue-900'
                          }`}
                        >
                          {advisory.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            advisory.type === 'success'
                              ? 'bg-green-100 text-green-700'
                              : advisory.type === 'warning'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {advisory.action}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          advisory.type === 'success'
                            ? 'text-green-700'
                            : advisory.type === 'warning'
                            ? 'text-amber-700'
                            : 'text-blue-700'
                        }`}
                      >
                        {advisory.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Climate Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Thermometer className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800">This Week</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Avg Temperature</span>
                  <span className="font-medium">25°C</span>
                </div>
                <div className="flex justify-between">
                  <span>High / Low</span>
                  <span className="font-medium">28° / 22°</span>
                </div>
                <div className="flex justify-between">
                  <span>Precipitation</span>
                  <span className="font-medium">35mm</span>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-100 rounded-xl">
                  <Droplets className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-bold text-gray-800">Moisture Index</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Soil Moisture</span>
                  <span className="font-medium text-green-600">Optimal</span>
                </div>
                <div className="flex justify-between">
                  <span>Humidity Avg</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="flex justify-between">
                  <span>Evapotranspiration</span>
                  <span className="font-medium">4.2mm/day</span>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-cyan-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Navigation className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800">Wind Conditions</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Avg Wind Speed</span>
                  <span className="font-medium">12 km/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Direction</span>
                  <span className="font-medium">NE</span>
                </div>
                <div className="flex justify-between">
                  <span>Gusts Up To</span>
                  <span className="font-medium">18 km/h</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
