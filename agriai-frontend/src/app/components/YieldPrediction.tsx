import { useState, useEffect } from 'react';
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
  TrendingUp,
  Loader2
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
import { api, FarmResponse, SoilReportResponse, YieldPredictionResponse } from '../api/client';

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
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [reports, setReports] = useState<SoilReportResponse[]>([]);
  
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedReportId, setSelectedReportId] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('Kharif');
  
  const [prediction, setPrediction] = useState<YieldPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFarms();
  }, []);

  useEffect(() => {
    if (selectedFarmId) {
      fetchReports(selectedFarmId);
    } else {
      setReports([]);
      setSelectedReportId('');
    }
  }, [selectedFarmId]);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const data = await api.getFarms();
      setFarms(data);
      if (data.length > 0) setSelectedFarmId(data[0].farm_id);
    } catch (err) {
      setError('Failed to fetch farms');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (farmId: string) => {
    try {
      const data = await api.getSoilReports(farmId);
      setReports(data);
      if (data.length > 0) setSelectedReportId(data[0].report_id);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  };

  const handlePredict = async () => {
    if (!selectedFarmId || !selectedReportId || !selectedCrop || !selectedSeason) {
      setError('Please select all fields');
      return;
    }

    try {
      setPredicting(true);
      setError(null);
      const res = await api.predictYield({
        farm_id: selectedFarmId,
        crop_name: selectedCrop,
        soil_report_id: selectedReportId,
        season: selectedSeason
      });
      setPrediction(res);
    } catch (err: any) {
      setError(err.message || 'Prediction failed');
    } finally {
      setPredicting(false);
    }
  };

  const currentFarm = farms.find(f => f.farm_id === selectedFarmId);

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
          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 shadow-sm">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Farm</label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a Farm</option>
                  {farms.map(farm => (
                    <option key={farm.farm_id} value={farm.farm_id}>{farm.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Soil Report</label>
                <select
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  disabled={!selectedFarmId || reports.length === 0}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {reports.length === 0 ? (
                    <option value="">No reports found</option>
                  ) : (
                    reports.map(report => (
                      <option key={report.report_id} value={report.report_id}>
                        {new Date(report.reported_at).toLocaleDateString()} - Report
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Corn">Corn</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Cotton">Cotton</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Season</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Zaid">Zaid</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={handlePredict}
                disabled={predicting || !selectedReportId}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {predicting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Generate Prediction
              </button>
            </div>
            
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>

          {prediction && (
            <>
              {/* Prediction Cards */}
              <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Main Prediction */}
                <div className="backdrop-blur-lg bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5" />
                    <span className="text-emerald-100">Total Production</span>
                  </div>
                  <div className="text-5xl font-bold mb-2">
                    {Math.round(prediction.total_predicted_yield_kg).toLocaleString()}
                  </div>
                  <div className="text-emerald-100 mb-4">kg (Predicted Total)</div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-lg rounded-lg">
                    <TrendIcon className="w-4 h-4 text-green-200" />
                    <span className="text-sm">Based on {currentFarm?.area_hectares || 1} hectares</span>
                  </div>
                </div>

                {/* Yield Per Acre */}
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">Yield Per Hectare</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {Math.round(prediction.predicted_yield_kg_per_hectare).toLocaleString()}
                  </div>
                  <div className="text-gray-600 mb-4">kg/hectare</div>
                  <div className="text-sm text-gray-500">Expected range: {Math.round(prediction.yield_range.low)} - {Math.round(prediction.yield_range.high)}</div>
                </div>

                {/* Confidence Score */}
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600">AI Confidence</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {Math.round(prediction.yield_range.confidence_level * 100)}%
                  </div>
                  <div className="text-gray-600 mb-4">High Precision</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${prediction.yield_range.confidence_level * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Yield Range Analytics */}
              <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Yield Range Analytics</h3>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">High Estimate (90th)</div>
                    <div className="text-3xl font-bold text-green-700">{Math.round(prediction.yield_range.high).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">kg/ha</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Point Estimate</div>
                    <div className="text-3xl font-bold text-blue-700">{Math.round(prediction.predicted_yield_kg_per_hectare).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">kg/ha</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Low Estimate (10th)</div>
                    <div className="text-3xl font-bold text-orange-700">{Math.round(prediction.yield_range.low).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">kg/ha</div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Prediction Insight</h4>
                      <p className="text-sm text-blue-700">
                        Based on your farm's soil data and current seasonal forecast, we predict a stable yield. 
                        The 80% confidence interval suggests that even in worst-case scenarios, your production remains viable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Charts (Static for now as they require time-series data) */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Seasonal Trends */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 shadow-sm">
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
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 shadow-sm">
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

          {/* Influencing Factors & Insights */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 shadow-sm">
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
            <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100 shadow-sm">
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
                    <div className={`p-3 rounded-lg bg-emerald-50`}>
                      <insight.icon className={`w-5 h-5 text-emerald-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full`}>
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
        </main>
      </div>
    </div>
  );
}
