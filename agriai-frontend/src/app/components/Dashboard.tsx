import { useState } from 'react';
import {
  Bell,
  Search,
  User,
  ChevronDown,
  MapPin,
  Droplets,
  Thermometer,
  Wind,
  Calendar,
  Zap,
  CheckCircle,
  AlertCircle,
  Menu,
  Sprout,
  CloudRain,
  Wheat,
  TestTube,
  Lightbulb,
  TrendingUp,
  Bug
} from 'lucide-react';
import Sidebar from './Sidebar';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const yieldData = [
  { month: 'Jan', yield: 65 },
  { month: 'Feb', yield: 72 },
  { month: 'Mar', yield: 78 },
  { month: 'Apr', yield: 85 },
  { month: 'May', yield: 92 },
  { month: 'Jun', yield: 88 }
];

const cropData = [
  { name: 'Wheat', value: 35, color: '#f59e0b' },
  { name: 'Corn', value: 25, color: '#10b981' },
  { name: 'Rice', value: 22, color: '#3b82f6' },
  { name: 'Soybean', value: 18, color: '#8b5cf6' }
];

const healthData = [
  { day: 'Mon', health: 88 },
  { day: 'Tue', health: 90 },
  { day: 'Wed', health: 85 },
  { day: 'Thu', health: 92 },
  { day: 'Fri', health: 95 },
  { day: 'Sat', health: 93 },
  { day: 'Sun', health: 94 }
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Dashboard"
        colorScheme="emerald"
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
        <header className="sticky top-0 z-30 backdrop-blur-lg bg-white/80 border-b border-emerald-100">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search farms, crops, insights..."
                    className="w-full pl-10 pr-4 py-2 bg-white/70 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                  <Bell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 px-4 py-2 backdrop-blur-lg bg-white/60 rounded-lg border border-emerald-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white">
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

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Section */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
                <p className="text-emerald-100">Here's what's happening with your farms today.</p>
              </div>
              <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl hover:shadow-xl transition-all flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Scan
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Farms',
                value: '12',
                change: '+2 this month',
                icon: Wheat,
                gradient: 'from-emerald-500 to-green-500',
                trend: 'up'
              },
              {
                title: 'Avg Crop Health',
                value: '94%',
                change: '+5% vs last week',
                icon: Sprout,
                gradient: 'from-teal-500 to-cyan-500',
                trend: 'up'
              },
              {
                title: 'Predicted Yield',
                value: '2,847',
                change: 'tons this season',
                icon: TrendingUp,
                gradient: 'from-blue-500 to-indigo-500',
                trend: 'up'
              },
              {
                title: 'Active Alerts',
                value: '3',
                change: 'Requires attention',
                icon: AlertCircle,
                gradient: 'from-amber-500 to-orange-500',
                trend: 'neutral'
              }
            ].map((card, index) => (
              <div
                key={index}
                className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                  <p className="text-xs text-gray-500">{card.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Yield Trend */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Yield Trend (Tons/Acre)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={yieldData}>
                  <defs>
                    <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #d1fae5',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#yieldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Crop Distribution */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Crop Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={cropData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cropData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #d1fae5',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weather & AI Insights */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Weather Widget */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Weather</h3>
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 mb-4">
                    <CloudRain className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-gray-800 mb-1">24°C</div>
                  <div className="text-gray-600">Partly Cloudy</div>
                  <div className="text-sm text-gray-500 mt-2">Iowa, United States</div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-emerald-200">
                  <div className="text-center">
                    <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-800">65%</div>
                    <div className="text-xs text-gray-500">Humidity</div>
                  </div>
                  <div className="text-center">
                    <Wind className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-800">12 km/h</div>
                    <div className="text-xs text-gray-500">Wind</div>
                  </div>
                  <div className="text-center">
                    <Thermometer className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-800">18°C</div>
                    <div className="text-xs text-gray-500">Feels Like</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="lg:col-span-2 backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                AI Insights & Recommendations
              </h3>

              <div className="space-y-4">
                {[
                  {
                    type: 'success',
                    title: 'Optimal Planting Window',
                    message: 'Next 3-5 days are ideal for planting corn in Field A based on soil moisture and weather forecast.',
                    time: '2 hours ago'
                  },
                  {
                    type: 'warning',
                    title: 'Disease Risk Alert',
                    message: 'Increased risk of leaf rust detected in wheat fields. Consider preventive fungicide application.',
                    time: '5 hours ago'
                  },
                  {
                    type: 'info',
                    title: 'Irrigation Recommendation',
                    message: 'Reduce irrigation by 15% in Field C. Current soil moisture levels are optimal for crop growth.',
                    time: '1 day ago'
                  }
                ].map((insight, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl bg-white/50 border border-emerald-100 hover:bg-white/70 transition-all"
                  >
                    <div
                      className={`p-2 rounded-lg h-fit ${
                        insight.type === 'success'
                          ? 'bg-green-100'
                          : insight.type === 'warning'
                          ? 'bg-amber-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      {insight.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : insight.type === 'warning' ? (
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      ) : (
                        <Lightbulb className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {insight.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Predictions & Farm Overview */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Predictions */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Predictions</h3>
              <div className="space-y-4">
                {[
                  {
                    farm: 'Green Valley Farm',
                    crop: 'Wheat',
                    prediction: '85 tons',
                    confidence: '94%',
                    status: 'Good'
                  },
                  {
                    farm: 'Sunny Acres',
                    crop: 'Corn',
                    prediction: '142 tons',
                    confidence: '91%',
                    status: 'Excellent'
                  },
                  {
                    farm: 'River Bend',
                    crop: 'Soybean',
                    prediction: '67 tons',
                    confidence: '88%',
                    status: 'Good'
                  },
                  {
                    farm: 'Mountain View',
                    crop: 'Rice',
                    prediction: '95 tons',
                    confidence: '92%',
                    status: 'Good'
                  }
                ].map((pred, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-emerald-100 hover:bg-white/70 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                        <Wheat className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{pred.farm}</h4>
                        <p className="text-sm text-gray-600">{pred.crop}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{pred.prediction}</div>
                      <div className="text-xs text-emerald-600">{pred.confidence} confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crop Health Trend */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Crop Health</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #d1fae5',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="health" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: TestTube, label: 'Soil Test', gradient: 'from-amber-500 to-orange-500' },
                { icon: Bug, label: 'Scan Disease', gradient: 'from-red-500 to-pink-500' },
                { icon: Lightbulb, label: 'Get Advice', gradient: 'from-emerald-500 to-green-500' },
                { icon: TrendingUp, label: 'Predict Yield', gradient: 'from-blue-500 to-indigo-500' },
                { icon: CloudRain, label: 'Weather', gradient: 'from-cyan-500 to-teal-500' },
                { icon: Wheat, label: 'Add Farm', gradient: 'from-violet-500 to-purple-500' }
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/50 border border-emerald-100 hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient}`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
