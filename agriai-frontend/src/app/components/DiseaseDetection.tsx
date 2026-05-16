import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Menu,
  Upload,
  Camera,
  Scan,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader,
  FileImage,
  Zap,
  Shield,
  Droplets,
  Sparkles,
  Bug,
  X
} from 'lucide-react';
import Sidebar from './Sidebar';
import { api } from '../api/client';

interface ScanResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Healthy' | 'Infected';
  description: string;
  treatments: string[];
  prevention: string[];
}

export default function DiseaseDetection() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Disease Detection');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setScanComplete(false);
      setScanResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(s);
      setShowCamera(true);
      // Wait for ref to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  useEffect(() => {
    if (isCameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isCameraOpen, cameraStream]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_plant.jpg", { type: "image/jpeg" });
            handleImageUpload(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const startScan = async () => {
    if (!imageFile) return;

    setIsScanning(true);
    setScanComplete(false);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await api.predictDisease(formData);

      setScanResult({
        disease: response.disease_name,
        confidence: response.confidence * 100,
        severity: response.severity as any,
        status: response.is_healthy ? 'Healthy' : 'Infected',
        description: `Scientific Name: ${response.scientific_name}. This assessment is based on the visual characteristics detected by our AI model.`,
        treatments: [
          `Chemical: ${response.treatment.chemical}`,
          `Biological: ${response.treatment.biological}`,
          `Cultural: ${response.treatment.cultural}`
        ],
        prevention: [
          'Maintain regular monitoring',
          'Practice good crop rotation',
          'Ensure proper sanitation of tools'
        ]
      });
      setScanComplete(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze image');
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'from-red-500 to-rose-600';
      case 'High': return 'from-orange-500 to-amber-600';
      case 'Medium': return 'from-yellow-500 to-orange-500';
      case 'Low': return 'from-emerald-500 to-green-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'Healthy' ? CheckCircle : XCircle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Disease Detection"
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
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">AI Disease Detection</h1>
                  <p className="text-sm text-gray-600">Identify plant diseases using advanced AI</p>
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

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Upload & Preview */}
            <div className="space-y-6">
              {/* Upload Section */}
              {!selectedImage ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`backdrop-blur-lg bg-white/60 rounded-3xl p-8 border-2 border-dashed transition-all ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02]'
                      : 'border-emerald-300'
                  }`}
                >
                  <div className="text-center space-y-6">
                    <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100">
                      <FileImage className="w-16 h-16 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Upload Plant Image</h3>
                      <p className="text-gray-600">Drag and drop your image here, or click to browse</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        Choose File
                      </button>

                      
                      <button
                        onClick={startCamera}
                        className="px-8 py-4 backdrop-blur-lg bg-white/80 border-2 border-emerald-200 text-emerald-700 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Use Camera
                      </button>
                    </div>

                    <div className="pt-6 border-t border-emerald-200">
                      <p className="text-sm text-gray-500">
                        Supported formats: JPG, PNG, WebP • Max size: 10MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Preview with Scanning Effect */}
                  <div className="backdrop-blur-lg bg-white/60 rounded-3xl p-6 border border-emerald-100">
                    <div className="relative rounded-2xl overflow-hidden bg-gray-900">
                      <img
                        src={selectedImage}
                        alt="Plant leaf preview"
                        className="w-full h-auto"
                      />

                      {/* Scanning Overlay */}
                      {isScanning && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"></div>
                            <div className="scanning-line"></div>
                          </div>
                          {/* Corner Markers */}
                          <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-emerald-400"></div>
                          <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-emerald-400"></div>
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-emerald-400"></div>
                          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-emerald-400"></div>
                        </div>
                      )}

                      {/* Computer Vision Grid Overlay */}
                      {(isScanning || scanComplete) && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                      {!isScanning && !scanComplete && (
                        <button
                          onClick={startScan}
                          className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Scan className="w-5 h-5" />
                          Start AI Scan
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setScanComplete(false);
                          setScanResult(null);
                          setIsScanning(false);
                        }}
                        className="px-6 py-4 backdrop-blur-lg bg-white/80 border-2 border-emerald-200 text-emerald-700 rounded-xl hover:bg-white transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Error Status */}
                  {error && (
                    <div className="backdrop-blur-lg bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                      <div className="flex items-center gap-4">
                        <AlertTriangle className="w-8 h-8" />
                        <div>
                          <h3 className="text-xl font-bold mb-1">Analysis Failed</h3>
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scanning Status */}
                  {isScanning && (
                    <div className="backdrop-blur-lg bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-4">
                        <Loader className="w-8 h-8 animate-spin" />
                        <div>
                          <h3 className="text-xl font-bold mb-1">AI Analysis in Progress</h3>
                          <p className="text-emerald-100">Processing image and detecting diseases...</p>
                        </div>
                      </div>
                      <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-white rounded-full animate-progress"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Info Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">AI Powered</span>
                  </div>
                  <p className="text-xs text-gray-600">Advanced machine learning models</p>
                </div>
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Instant Results</span>
                  </div>
                  <p className="text-xs text-gray-600">Get diagnosis in seconds</p>
                </div>
                <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-violet-100">
                      <Shield className="w-5 h-5 text-violet-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">98% Accurate</span>
                  </div>
                  <p className="text-xs text-gray-600">Clinically validated accuracy</p>
                </div>
              </div>
            </div>

            {/* Right Side - Results */}
            <div className="space-y-6">
              {scanComplete && scanResult ? (
                <>
                  {/* Status Card */}
                  <div className={`backdrop-blur-lg bg-gradient-to-br ${
                    scanResult.status === 'Healthy'
                      ? 'from-emerald-600 to-green-600'
                      : 'from-red-600 to-rose-600'
                  } rounded-3xl p-8 text-white`}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {scanResult.status === 'Healthy' ? (
                            <CheckCircle className="w-8 h-8" />
                          ) : (
                            <XCircle className="w-8 h-8" />
                          )}
                          <h2 className="text-3xl font-bold">{scanResult.status}</h2>
                        </div>
                        <p className="text-lg opacity-90">{scanResult.disease}</p>
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">Confidence Score</span>
                        <span className="text-2xl font-bold">{scanResult.confidence}%</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-1000"
                          style={{ width: `${scanResult.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Severity Indicator */}
                  <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Severity Level</h3>
                    <div className="flex items-center gap-4">
                      <div className={`flex-1 h-12 rounded-xl bg-gradient-to-r ${getSeverityColor(scanResult.severity)} flex items-center justify-center text-white font-bold`}>
                        {scanResult.severity}
                      </div>
                      {scanResult.severity !== 'Low' && (
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{scanResult.description}</p>
                  </div>

                  {/* Treatment Suggestions */}
                  <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Droplets className="w-6 h-6 text-emerald-600" />
                      Treatment Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {scanResult.treatments.map((treatment, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="mt-1">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <p className="text-gray-700 flex-1">{treatment}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention Tips */}
                  <div className="backdrop-blur-lg bg-white/60 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-blue-600" />
                      Prevention Tips
                    </h3>
                    <ul className="space-y-3">
                      {scanResult.prevention.map((tip, index) => (
                        <li key={index} className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                          <p className="text-gray-700 flex-1">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all">
                      Save Report
                    </button>
                    <button className="px-6 py-4 backdrop-blur-lg bg-white/80 border-2 border-emerald-200 text-emerald-700 rounded-xl hover:bg-white transition-all">
                      Contact Expert
                    </button>
                  </div>
                </>
              ) : (
                <div className="backdrop-blur-lg bg-white/60 rounded-3xl p-12 border border-emerald-100 text-center">
                  <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 mb-6">
                    <Bug className="w-16 h-16 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Upload an Image to Begin
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Our AI will analyze your plant image and detect any diseases with high accuracy. Get instant treatment recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Live Camera Overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-2xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
              <button
                onClick={stopCamera}
                className="p-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all"
              >
                <XCircle className="w-8 h-8" />
              </button>
              <button
                onClick={capturePhoto}
                className="p-6 bg-white rounded-full text-emerald-600 shadow-xl hover:scale-110 transition-all"
              >
                <Camera className="w-8 h-8" />
              </button>
            </div>
            
            <div className="absolute top-4 left-4 text-white text-sm font-medium bg-black/40 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live Camera
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scanning-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, #10b981, transparent);
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(500px);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-progress {
          animation: progress 3s ease-in-out;
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-2xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-auto aspect-video object-cover"
            />
            
            {/* Camera Overlay UI */}
            <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/30 m-8 rounded-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Live Camera
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent">
              <button 
                onClick={stopCamera}
                className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 bg-white rounded-full p-1 shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                <div className="w-full h-full border-4 border-gray-900 rounded-full bg-white flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                </div>
              </button>
              
              <div className="w-14"></div> {/* Spacer for symmetry */}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
