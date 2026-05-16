import { useState } from 'react';
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Plus,
  MapPin,
  Calendar,
  Droplets,
  ThermometerSun,
  Activity,
  ArrowUp,
  Menu,
  MoreVertical,
  CheckCircle,
  Sprout,
  Wheat,
  TestTube
} from 'lucide-react';
import Sidebar from './Sidebar';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Link } from 'react-router';
import { X } from 'lucide-react';

const seasonalData = [
  { season: 'Spring', yield: 75, quality: 85, efficiency: 78 },
  { season: 'Summer', yield: 92, quality: 88, efficiency: 85 },
  { season: 'Fall', yield: 88, quality: 90, efficiency: 87 },
  { season: 'Winter', yield: 65, quality: 82, efficiency: 72 }
];

const productionData = [
  { month: 'Jan', production: 45 },
  { month: 'Feb', production: 52 },
  { month: 'Mar', production: 68 },
  { month: 'Apr', production: 78 },
  { month: 'May', production: 85 },
  { month: 'Jun', production: 92 }
];

const soilHealthData = [
  { metric: 'Nitrogen', value: 85 },
  { metric: 'Phosphorus', value: 78 },
  { metric: 'Potassium', value: 82 },
  { metric: 'pH Level', value: 90 },
  { metric: 'Moisture', value: 75 },
  { metric: 'Organic Matter', value: 88 }
];

const farms = [
  {
    id: 1,
    name: 'Green Valley Farm',
    location: '41.8781° N, 87.6298° W',
    area: 125.5,
    currentCrop: 'Wheat',
    soilHealth: 'Excellent',
    soilScore: 94,
    lastUpdated: '2 hours ago',
    cropHistory: ['Wheat', 'Corn', 'Soybean'],
    moisture: 68,
    temperature: 24,
    status: 'active',
    yieldPrediction: 145
  },
  {
    id: 2,
    name: 'Sunny Acres',
    location: '40.7128° N, 74.0060° W',
    area: 87.3,
    currentCrop: 'Corn',
    soilHealth: 'Good',
    soilScore: 88,
    lastUpdated: '5 hours ago',
    cropHistory: ['Corn', 'Wheat', 'Rice'],
    moisture: 72,
    temperature: 26,
    status: 'active',
    yieldPrediction: 98
  },
  {
    id: 3,
    name: 'River Bend Farm',
    location: '39.9612° N, 82.9988° W',
    area: 156.8,
    currentCrop: 'Soybean',
    soilHealth: 'Good',
    soilScore: 86,
    lastUpdated: '1 day ago',
    cropHistory: ['Soybean', 'Wheat', 'Corn'],
    moisture: 65,
    temperature: 23,
    status: 'active',
    yieldPrediction: 112
  },
  {
    id: 4,
    name: 'Mountain View',
    location: '37.7749° N, 122.4194° W',
    area: 203.2,
    currentCrop: 'Rice',
    soilHealth: 'Excellent',
    soilScore: 92,
    lastUpdated: '3 hours ago',
    cropHistory: ['Rice', 'Wheat', 'Barley'],
    moisture: 78,
    temperature: 25,
    status: 'monitoring',
    yieldPrediction: 187
  }
];

export default function FarmManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Farms');
  const [selectedFarm, setSelectedFarm] = useState<number | null>(null);
  const [showAddFarm, setShowAddFarm] = useState(false);


  const activeFarm = selectedFarm ? farms.find(f => f.id === selectedFarm) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Farms"
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
                    placeholder="Search farms..."
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

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Farm Management</h1>
              <p className="text-gray-600">Manage and monitor all your farms in one place</p>
            </div>
            <button
              onClick={() => setShowAddFarm(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Farm
            </button>
          </div>

          {/* Farm Performance Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Farms',
                value: '4',
                change: '+1',
                trend: 'up',
                icon: Wheat,
                gradient: 'from-emerald-500 to-green-500'
              },
              {
                title: 'Total Area',
                value: '572.8',
                unit: 'hectares',
                change: '+12.5%',
                trend: 'up',
                icon: MapPin,
                gradient: 'from-teal-500 to-cyan-500'
              },
              {
                title: 'Avg Soil Health',
                value: '90%',
                change: '+3%',
                trend: 'up',
                icon: TestTube,
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                title: 'Active Crops',
                value: '4',
                change: 'All monitored',
                trend: 'neutral',
                icon: Sprout,
                gradient: 'from-violet-500 to-purple-500'
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
                  {card.trend === 'up' && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <ArrowUp className="w-4 h-4" />
                      {card.change}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {card.value}
                    {card.unit && <span className="text-lg text-gray-500 ml-1">{card.unit}</span>}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Farm Cards Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Farms</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedFarm(farm.id === selectedFarm ? null : farm.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                        <Wheat className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{farm.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {farm.location}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="backdrop-blur-lg bg-white/50 rounded-xl p-4 border border-emerald-100">
                      <div className="text-xs text-gray-600 mb-1">Area</div>
                      <div className="text-lg font-bold text-gray-800">{farm.area} ha</div>
                    </div>
                    <div className="backdrop-blur-lg bg-white/50 rounded-xl p-4 border border-emerald-100">
                      <div className="text-xs text-gray-600 mb-1">Current Crop</div>
                      <div className="text-lg font-bold text-gray-800">{farm.currentCrop}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-gray-700">Soil Health</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">{farm.soilHealth}</span>
                        <span className="text-xs text-emerald-600">({farm.soilScore}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                        style={{ width: `${farm.soilScore}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-600">Moisture: {farm.moisture}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThermometerSun className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-600">Temp: {farm.temperature}°C</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600">Updated {farm.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${farm.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="text-xs text-gray-700 capitalize">{farm.status}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-gray-600">Crop History:</span>
                    <div className="flex items-center gap-2">
                      {farm.cropHistory.map((crop, idx) => (
                        <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-lg">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farm Details Section (when farm is selected) */}
          {activeFarm && (
            <div className="space-y-6">
              <div className="backdrop-blur-lg bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{activeFarm.name} - Detailed View</h2>
                    <p className="text-emerald-100">Comprehensive analytics and insights</p>
                  </div>
                  <button
                    onClick={() => setSelectedFarm(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Interactive Farm Map Placeholder */}
              <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Farm Location & Map
                </h3>
                <div className="relative w-full h-80 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl overflow-hidden">
                  {/* Map Placeholder */}
                  <img
                    src="https://images.unsplash.com/photo-1776687300225-a9f112122d17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt="Farm aerial view"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="backdrop-blur-lg bg-white/80 rounded-2xl p-6 text-center border border-emerald-200">
                      <MapPin className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-800 mb-2">GPS Location</h4>
                      <p className="text-gray-700 font-mono text-sm mb-3">{activeFarm.location}</p>
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div>
                          <div className="text-xs text-gray-600">Total Area</div>
                          <div className="text-lg font-bold text-gray-800">{activeFarm.area} ha</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Yield Prediction</div>
                          <div className="text-lg font-bold text-gray-800">{activeFarm.yieldPrediction} tons</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Seasonal Performance */}
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Seasonal Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={seasonalData}>
                      <PolarGrid stroke="#d1fae5" />
                      <PolarAngleAxis dataKey="season" stroke="#6b7280" />
                      <PolarRadiusAxis stroke="#6b7280" />
                      <Radar name="Yield" dataKey="yield" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Radar name="Quality" dataKey="quality" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Radar name="Efficiency" dataKey="efficiency" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #d1fae5',
                          borderRadius: '8px'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Production Trend */}
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Production Trend (Tons)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={productionData}>
                      <defs>
                        <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
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
                        dataKey="production"
                        stroke="#14b8a6"
                        strokeWidth={3}
                        fill="url(#productionGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Soil Health Analysis */}
              <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-emerald-600" />
                  Detailed Soil Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={soilHealthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="metric" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #d1fae5',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {[
                    { label: 'Overall Health', value: activeFarm.soilScore + '%', icon: CheckCircle, color: 'green' },
                    { label: 'Moisture Level', value: activeFarm.moisture + '%', icon: Droplets, color: 'blue' },
                    { label: 'Temperature', value: activeFarm.temperature + '°C', icon: ThermometerSun, color: 'orange' }
                  ].map((stat, idx) => (
                    <div key={idx} className="backdrop-blur-lg bg-white/50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                        <span className="text-xs text-gray-600">{stat.label}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Farm Modal */}
      {showAddFarm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-lg bg-white/90 rounded-3xl p-8 max-w-2xl w-full border border-emerald-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Farm</h2>
              <button
                onClick={() => setShowAddFarm(false)}
                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Farm Name</label>
                  <input
                    type="text"
                    placeholder="Enter farm name"
                    className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Area (hectares)</label>
                  <input
                    type="number"
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">GPS Location</label>
                <input
                  type="text"
                  placeholder="Latitude, Longitude"
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Current Crop</label>
                <select className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Select crop type</option>
                  <option>Wheat</option>
                  <option>Corn</option>
                  <option>Rice</option>
                  <option>Soybean</option>
                  <option>Barley</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddFarm(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-emerald-200 text-gray-700 rounded-xl hover:bg-emerald-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all"
                >
                  Add Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
