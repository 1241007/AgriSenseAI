import { useState } from 'react';
import { Link } from 'react-router';
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Menu,
  ArrowLeft,
  Sparkles,
  TrendingUp as TrendingUpIcon,
  BarChart3,
  Cloud,
  Calendar,
  MapPin,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Sprout,
  Wheat,
  TestTube,
  Lightbulb
} from 'lucide-react';
import Sidebar from './Sidebar';

const recommendedCrops = [
  {
    name: 'Rice',
    suitability: 95,
    expectedYield: '4.2 tons/acre',
    seasonMatch: 'Excellent',
    waterReq: 'High',
    profitMargin: 'High',
    growthPeriod: '120-150 days',
    weatherCompatibility: 95,
    soilMatch: 92,
    marketDemand: 88,
    rotationScore: 90,
    image: '🌾',
    bgGradient: 'from-amber-500 to-orange-500',
    pros: ['High market demand', 'Excellent soil match', 'Good rotation crop'],
    cons: ['High water requirement', 'Labor intensive']
  },
  {
    name: 'Wheat',
    suitability: 88,
    expectedYield: '3.8 tons/acre',
    seasonMatch: 'Good',
    waterReq: 'Moderate',
    profitMargin: 'Moderate',
    growthPeriod: '110-130 days',
    weatherCompatibility: 90,
    soilMatch: 88,
    marketDemand: 85,
    rotationScore: 87,
    image: '🌾',
    bgGradient: 'from-yellow-500 to-amber-500',
    pros: ['Lower water needs', 'Stable market price', 'Good for rotation'],
    cons: ['Moderate profit margin', 'Pest susceptible']
  },
  {
    name: 'Sugarcane',
    suitability: 82,
    expectedYield: '45 tons/acre',
    seasonMatch: 'Good',
    waterReq: 'High',
    profitMargin: 'Very High',
    growthPeriod: '12-18 months',
    weatherCompatibility: 85,
    soilMatch: 80,
    marketDemand: 90,
    rotationScore: 75,
    image: '🎋',
    bgGradient: 'from-green-500 to-emerald-500',
    pros: ['Very high profit', 'Long shelf life', 'Strong market'],
    cons: ['Long growth period', 'High water needs', 'Soil depletion']
  },
  {
    name: 'Cotton',
    suitability: 78,
    expectedYield: '2.5 tons/acre',
    seasonMatch: 'Moderate',
    waterReq: 'Moderate',
    profitMargin: 'High',
    growthPeriod: '150-180 days',
    weatherCompatibility: 75,
    soilMatch: 82,
    marketDemand: 80,
    rotationScore: 70,
    image: '🌼',
    bgGradient: 'from-blue-500 to-indigo-500',
    pros: ['Good profit margin', 'Export potential', 'Moderate water'],
    cons: ['Weather sensitive', 'Requires pesticides', 'Market fluctuation']
  }
];

export default function CropRecommendation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    season: '',
    previousCrop: '',
    region: ''
  });
  const [showResults, setShowResults] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Crop Recommendation"
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
                <Lightbulb className="w-8 h-8 text-emerald-600" />
                AI Crop Recommendation
              </h1>
              <p className="text-gray-600 mt-1">Get smart crop suggestions based on soil and environmental data</p>
            </div>
          </div>

          {/* Input Form */}
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
            <div className="flex items-center gap-2 mb-6">
              <TestTube className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">Enter Farm Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Soil Nutrients */}
              <div>
                <h3 className="font-medium text-gray-800 mb-4">Soil Nutrient Report</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Nitrogen (N) kg/ha</label>
                    <input
                      type="number"
                      value={formData.nitrogen}
                      onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                      placeholder="e.g., 45"
                      className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Phosphorus (P) kg/ha</label>
                    <input
                      type="number"
                      value={formData.phosphorus}
                      onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                      placeholder="e.g., 30"
                      className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Potassium (K) kg/ha</label>
                    <input
                      type="number"
                      value={formData.potassium}
                      onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                      placeholder="e.g., 35"
                      className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">pH Level</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.ph}
                      onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                      placeholder="e.g., 6.5"
                      className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Other Details */}
              <div>
                <h3 className="font-medium text-gray-800 mb-4">Farm Context</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Season</label>
                    <select
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">Select Season</option>
                      <option value="kharif">Kharif (Monsoon)</option>
                      <option value="rabi">Rabi (Winter)</option>
                      <option value="zaid">Zaid (Summer)</option>
                      <option value="whole-year">Whole Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Previous Crop</label>
                    <select
                      value={formData.previousCrop}
                      onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
                      className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">Select Previous Crop</option>
                      <option value="rice">Rice</option>
                      <option value="wheat">Wheat</option>
                      <option value="cotton">Cotton</option>
                      <option value="sugarcane">Sugarcane</option>
                      <option value="maize">Maize</option>
                      <option value="none">None (First Crop)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Region</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">Select Region</option>
                      <option value="north">North</option>
                      <option value="south">South</option>
                      <option value="east">East</option>
                      <option value="west">West</option>
                      <option value="central">Central</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Get AI Recommendations
              </button>
            </form>
          </div>

          {/* Results Section */}
          {showResults && (
            <>
              {/* Analytics Overview */}
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { label: 'Best Match', value: 'Rice', icon: Sprout, color: 'from-green-500 to-emerald-500' },
                  { label: 'Avg Suitability', value: '86%', icon: BarChart3, color: 'from-blue-500 to-indigo-500' },
                  { label: 'Season', value: 'Kharif', icon: Calendar, color: 'from-purple-500 to-violet-500' },
                  { label: 'Region', value: 'North', icon: MapPin, color: 'from-orange-500 to-amber-500' }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100"
                  >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                    <div className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Recommended Crops */}
              <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-xl font-bold text-gray-800">Recommended Crops (Ranked)</h2>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {recommendedCrops.map((crop, index) => (
                    <div
                      key={index}
                      className="backdrop-blur-lg bg-white/70 rounded-2xl border-2 border-emerald-100 overflow-hidden hover:shadow-xl transition-all"
                    >
                      {/* Header */}
                      <div className={`bg-gradient-to-r ${crop.bgGradient} p-6 text-white`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-5xl">{crop.image}</div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-2xl font-bold">{crop.name}</h3>
                                <span className="px-2 py-1 bg-white/20 backdrop-blur-lg rounded-lg text-xs">
                                  #{index + 1}
                                </span>
                              </div>
                              <p className="text-white/90">Expected: {crop.expectedYield}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold">{crop.suitability}%</div>
                            <div className="text-xs text-white/80">Suitability</div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <Cloud className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="text-xs text-gray-600">Weather Match</div>
                              <div className="font-bold text-gray-800">{crop.weatherCompatibility}%</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                            <TestTube className="w-5 h-5 text-amber-600" />
                            <div>
                              <div className="text-xs text-gray-600">Soil Match</div>
                              <div className="font-bold text-gray-800">{crop.soilMatch}%</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="text-xs text-gray-600">Market Demand</div>
                              <div className="font-bold text-gray-800">{crop.marketDemand}%</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <RefreshCw className="w-5 h-5 text-purple-600" />
                            <div>
                              <div className="text-xs text-gray-600">Rotation Score</div>
                              <div className="font-bold text-gray-800">{crop.rotationScore}%</div>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-emerald-100">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Water Req.</div>
                            <div className="font-medium text-gray-800">{crop.waterReq}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Profit</div>
                            <div className="font-medium text-gray-800">{crop.profitMargin}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Growth</div>
                            <div className="font-medium text-gray-800">{crop.growthPeriod}</div>
                          </div>
                        </div>

                        {/* Pros & Cons */}
                        <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-emerald-100">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Pros</span>
                            </div>
                            <ul className="space-y-1">
                              {crop.pros.map((pro, i) => (
                                <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                  <span className="text-green-600 mt-0.5">•</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-gray-700">Cons</span>
                            </div>
                            <ul className="space-y-1">
                              {crop.cons.map((con, i) => (
                                <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                  <span className="text-orange-600 mt-0.5">•</span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rotation Advice */}
              <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center gap-2 mb-6">
                  <RefreshCw className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-bold text-gray-800">Crop Rotation Advice</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      season: 'Current Season (Kharif)',
                      crop: 'Rice',
                      reason: 'Ideal for monsoon season with high soil moisture. Replenishes nitrogen in soil.',
                      icon: Sprout,
                      bgColor: 'bg-emerald-100',
                      iconColor: 'text-emerald-600'
                    },
                    {
                      season: 'Next Season (Rabi)',
                      crop: 'Wheat',
                      reason: 'Perfect follow-up to rice. Benefits from residual moisture and complements nutrient cycle.',
                      icon: Wheat,
                      bgColor: 'bg-amber-100',
                      iconColor: 'text-amber-600'
                    },
                    {
                      season: 'Future (Zaid)',
                      crop: 'Legumes',
                      reason: 'Restore nitrogen levels. Short growing period allows soil recovery before next cycle.',
                      icon: Sparkles,
                      bgColor: 'bg-purple-100',
                      iconColor: 'text-purple-600'
                    }
                  ].map((rotation, index) => (
                    <div
                      key={index}
                      className="backdrop-blur-lg bg-white/70 rounded-xl p-6 border border-emerald-100 hover:shadow-lg transition-all"
                    >
                      <div className={`inline-flex p-3 rounded-xl ${rotation.bgColor} mb-4`}>
                        <rotation.icon className={`w-6 h-6 ${rotation.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{rotation.season}</h3>
                      <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                        {rotation.crop}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{rotation.reason}</p>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Rotation Best Practices</h4>
                      <p className="text-sm text-blue-700">
                        Rotate crops with different root depths and nutrient requirements. Include legumes every 2-3 cycles to restore nitrogen.
                        Avoid planting the same crop family consecutively to prevent soil depletion and pest buildup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
