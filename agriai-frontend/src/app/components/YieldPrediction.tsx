import { useState } from 'react';
import { Link } from 'react-router';
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Menu,
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  BarChart3,
  Target,
  TrendingUp as TrendIcon,
  Sun,
  Droplets,
  Leaf,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import Sidebar from './Sidebar';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const seasonalTrends = [
  { month: 'Jan', wheat: 3200, rice: 0, corn: 0 },
  { month: 'Feb', wheat: 3500, rice: 0, corn: 0 },
  { month: 'Mar', wheat: 3800, rice: 2800, corn: 0 },
  { month: 'Apr', wheat: 4000, rice: 3200, corn: 1800 },
  { month: 'May', wheat: 3800, rice: 3800, corn: 2400 },
  { month: 'Jun', wheat: 0, rice: 4200, corn: 2800 },
  { month: 'Jul', wheat: 0, rice: 4500, corn: 3200 },
  { month: 'Aug', wheat: 0, rice: 4200, corn: 3600 }
];

const yieldComparison = [
  { year: '2022', predicted: 3800, actual: 3650 },
  { year: '2023', predicted: 4200, actual: 4100 },
  { year: '2024', predicted: 4500, actual: 4450 },
  { year: '2025', predicted: 4800, actual: 0 },
  { year: '2026', predicted: 5200, actual: 0 }
];

const influencingFactors = [
  { factor: 'Soil Health', value: 92 },
  { factor: 'Water Availability', value: 85 },
  { factor: 'Weather Patterns', value: 78 },
  { factor: 'Pest Management', value: 88 },
  { factor: 'Fertilizer Usage', value: 82 },
  { factor: 'Crop Rotation', value: 90 }
];

export default function YieldPrediction() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState('Green Valley Farm');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedSeason, setSelectedSeason] = useState('Rabi 2026');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Yield Prediction"
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

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                AI Yield Prediction
              </h1>
              <p className="text-gray-600 mt-1">Advanced forecasting powered by machine learning</p>
            </div>
          </div>

          {/* Selectors */}
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Farm</label>
                <select
                  value={selectedFarm}
                  onChange={(e) => setSelectedFarm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Green Valley Farm</option>
                  <option>Sunny Acres</option>
                  <option>River Bend</option>
                  <option>Mountain View</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Corn</option>
                  <option>Soybean</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Season</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Rabi 2026</option>
                  <option>Kharif 2026</option>
                  <option>Zaid 2026</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prediction Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Prediction */}
            <div className="backdrop-blur-lg bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5" />
                <span className="text-emerald-100">Predicted Yield</span>
              </div>
              <div className="text-5xl font-bold mb-2">4,847</div>
              <div className="text-emerald-100 mb-4">tons (Total Production)</div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-lg rounded-lg">
                <TrendIcon className="w-4 h-4 text-green-200" />
                <span className="text-sm">+12% vs last season</span>
              </div>
            </div>

            {/* Yield Per Acre */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Yield Per Acre</span>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">3.8</div>
              <div className="text-gray-600 mb-4">tons/acre</div>
              <div className="text-sm text-gray-500">Industry Avg: 3.2 tons/acre</div>
            </div>

            {/* Confidence Score */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600">AI Confidence</span>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">94%</div>
              <div className="text-gray-600 mb-4">Very High</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>

          {/* Yield Range Analytics */}
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Yield Range Analytics</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Best Case</div>
                <div className="text-3xl font-bold text-green-700">5,240</div>
                <div className="text-xs text-gray-500 mt-1">tons (+8.1%)</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Expected</div>
                <div className="text-3xl font-bold text-blue-700">4,847</div>
                <div className="text-xs text-gray-500 mt-1">tons (baseline)</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Worst Case</div>
                <div className="text-3xl font-bold text-orange-700">4,320</div>
                <div className="text-xs text-gray-500 mt-1">tons (-10.9%)</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Prediction Insight</h4>
                  <p className="text-sm text-blue-700">
                    Based on current soil health (92%), weather forecasts, and historical data, your yield is expected to
                    exceed regional averages by 18%. Optimal conditions detected for maximum productivity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Seasonal Trends */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Seasonal Yield Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={seasonalTrends}>
                  <defs>
                    <linearGradient id="wheatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="riceGradient" x1="0" y1="0" x2="0" y2="1">
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
                  <Legend />
                  <Area type="monotone" dataKey="wheat" stroke="#f59e0b" fill="url(#wheatGradient)" />
                  <Area type="monotone" dataKey="rice" stroke="#10b981" fill="url(#riceGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Prediction vs Actual */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Prediction Accuracy</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yieldComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #d1fae5',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="predicted" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="actual" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Influencing Factors */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Influencing Factors</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={influencingFactors}>
                  <PolarGrid stroke="#d1d5db" />
                  <PolarAngleAxis dataKey="factor" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                  <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
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

            {/* Production Insights */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Production Insights</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Sun,
                    title: 'Weather Conditions',
                    status: 'Favorable',
                    description: 'Optimal rainfall and temperature patterns expected',
                    color: 'green'
                  },
                  {
                    icon: Droplets,
                    title: 'Water Availability',
                    status: 'Good',
                    description: 'Irrigation systems at 85% capacity',
                    color: 'blue'
                  },
                  {
                    icon: Leaf,
                    title: 'Soil Nutrients',
                    status: 'Excellent',
                    description: 'NPK levels within optimal range',
                    color: 'emerald'
                  },
                  {
                    icon: Activity,
                    title: 'Crop Health',
                    status: 'Very Good',
                    description: 'No disease detected, growth on track',
                    color: 'teal'
                  }
                ].map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-emerald-100"
                  >
                    <div className={`p-3 rounded-lg bg-${insight.color}-100`}>
                      <insight.icon className={`w-5 h-5 text-${insight.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 bg-${insight.color}-100 text-${insight.color}-700 rounded-full`}>
                          {insight.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">AI Recommendations to Maximize Yield</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  type: 'success',
                  title: 'Continue Current Practices',
                  message: 'Maintain irrigation schedule and nutrient application rates. Current approach is optimal.',
                  icon: CheckCircle2
                },
                {
                  type: 'warning',
                  title: 'Monitor Weather Closely',
                  message: 'Potential dry spell in 2 weeks. Consider increasing water reserves by 15%.',
                  icon: AlertTriangle
                },
                {
                  type: 'info',
                  title: 'Pest Prevention',
                  message: 'Apply preventive pesticide treatment before flowering stage to protect yield potential.',
                  icon: Activity
                },
                {
                  type: 'success',
                  title: 'Soil Amendment',
                  message: 'Minor phosphorus boost recommended mid-season. Expected yield increase: +3-5%.',
                  icon: Leaf
                }
              ].map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    rec.type === 'success'
                      ? 'bg-green-50 border-green-200'
                      : rec.type === 'warning'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex gap-3">
                    <rec.icon
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        rec.type === 'success'
                          ? 'text-green-600'
                          : rec.type === 'warning'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <div>
                      <h4
                        className={`font-medium mb-1 ${
                          rec.type === 'success'
                            ? 'text-green-900'
                            : rec.type === 'warning'
                            ? 'text-amber-900'
                            : 'text-blue-900'
                        }`}
                      >
                        {rec.title}
                      </h4>
                      <p
                        className={`text-sm ${
                          rec.type === 'success'
                            ? 'text-green-700'
                            : rec.type === 'warning'
                            ? 'text-amber-700'
                            : 'text-blue-700'
                        }`}
                      >
                        {rec.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
