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

export default function YieldPrediction() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [soilReports, setSoilReports] = useState<SoilReportResponse[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedSeason, setSelectedSeason] = useState('Rabi 2026');
  
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<YieldPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const data = await api.getFarms();
        setFarms(data);
        if (data.length > 0) setSelectedFarmId(data[0].farm_id);
      } catch (err) {
        console.error("Failed to fetch farms", err);
      }
    };
    fetchFarms();
  }, []);

  useEffect(() => {
    if (selectedFarmId) {
      const fetchReports = async () => {
        try {
          const data = await api.getSoilReports(selectedFarmId);
          setSoilReports(data);
          if (data.length > 0) setSelectedReportId(data[0].report_id);
          else setSelectedReportId('');
        } catch (err) {
          console.error("Failed to fetch reports", err);
        }
      };
      fetchReports();
    }
  }, [selectedFarmId]);

  const handlePredict = async () => {
    if (!selectedFarmId || !selectedReportId) {
      setError("Please select a farm and a soil report");
      return;
    }

    setIsPredicting(true);
    setError(null);
    try {
      const result = await api.predictYield({
        farm_id: selectedFarmId,
        soil_report_id: selectedReportId,
        crop_name: selectedCrop,
        season: selectedSeason
      });
      setPrediction(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to predict yield");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Yield Prediction"
        colorScheme="emerald"
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64">
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
                <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">Yield Forecasting</h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 backdrop-blur-lg bg-white/60 rounded-lg border border-emerald-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-800">John Farmer</div>
                    <div className="text-xs text-gray-600">Premium Plan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
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
          </div>

          <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm</label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {farms.map(f => (
                    <option key={f.farm_id} value={f.farm_id}>{f.name}</option>
                  ))}
                  {farms.length === 0 && <option value="">No farms found</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Report</label>
                <select
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {soilReports.map(r => (
                    <option key={r.report_id} value={r.report_id}>{new Date(r.created_at).toLocaleDateString()}</option>
                  ))}
                  {soilReports.length === 0 && <option value="">No reports found</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crop</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Corn</option>
                  <option>Soybean</option>
                  <option>Sugarcane</option>
                </select>
              </div>
              <button
                onClick={handlePredict}
                disabled={isPredicting || !selectedReportId}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPredicting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Predict Yield
              </button>
            </div>
            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
          </div>

          {prediction ? (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="backdrop-blur-lg bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5" />
                    <span className="text-emerald-100">Predicted Yield</span>
                  </div>
                  <div className="text-5xl font-bold mb-2">{prediction.total_yield_kg.toLocaleString()}</div>
                  <div className="text-emerald-100 mb-4">kg (Total Production)</div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-lg rounded-lg">
                    <TrendIcon className="w-4 h-4 text-green-200" />
                    <span className="text-sm">Based on {prediction.predicted_yield_kg_per_hectare} kg/ha</span>
                  </div>
                </div>

                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">Yield Range</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {prediction.yield_range.low.toLocaleString()} - {prediction.yield_range.high.toLocaleString()}
                  </div>
                  <div className="text-gray-600 mb-4">kg/ha</div>
                  <div className="text-sm text-gray-500">Confidence Level: {prediction.yield_range.confidence_level * 100}%</div>
                </div>

                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600">Key Factors</span>
                  </div>
                  <div className="space-y-2">
                    {prediction.key_factors.map((f, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{f.factor}</span>
                        <span className={`font-medium ${f.impact === 'Optimal' || f.impact === 'High' || f.impact === 'Favorable' ? 'text-emerald-600' : 'text-orange-600'}`}>
                          {f.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Seasonal Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={seasonalTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey={selectedCrop.toLowerCase()} stroke="#10b981" fill="#d1fae5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Historical Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yieldComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="predicted" fill="#3b82f6" />
                      <Bar dataKey="actual" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="backdrop-blur-lg bg-white/60 rounded-3xl p-12 border border-emerald-100 text-center">
              <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 mb-6">
                <TrendIcon className="w-16 h-16 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Get Your Yield Forecast</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Select a farm and a recent soil report to generate an AI-powered yield prediction based on current conditions and weather forecasts.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
