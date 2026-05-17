import { useState } from 'react';
import { Link } from 'react-router';
import {
  User, Bell, Globe, Shield, Settings, Camera, Mail, Phone, MapPin,
  Moon, Sun, Lock, Smartphone, Monitor, AlertTriangle, LogOut, Trash2,
  Check, ChevronDown, ChevronRight
} from 'lucide-react';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weather: true,
    yield: true,
    disease: true,
    market: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'farm', label: 'Farm Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-lg bg-white/80 border border-emerald-100 rounded-2xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Settings</h1>
            <p className="text-sm text-gray-600 hidden sm:block">Manage your account and preferences</p>
          </div>
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

      <div className="p-4 sm:p-6 lg:p-8">
          {/* Tab Navigation */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'bg-white/60 text-gray-700 hover:bg-white border border-emerald-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Information</h2>
                <p className="text-gray-600">Update your personal details and profile picture</p>
              </div>

              {/* Avatar Section */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold">
                      JD
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-emerald-100 hover:bg-emerald-50 transition-colors">
                      <Camera className="w-4 h-4 text-emerald-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">John Doe</h3>
                    <p className="text-gray-600 text-sm">john.doe@agri.com</p>
                    <button className="mt-2 text-emerald-600 text-sm font-medium hover:text-emerald-700">
                      Upload new photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        defaultValue="john.doe@agri.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        defaultValue="Iowa, United States"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      defaultValue="Experienced farmer specializing in sustainable agriculture and modern farming techniques."
                      className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Notification Preferences</h2>
                <p className="text-gray-600">Manage how you receive updates and alerts</p>
              </div>

              {/* Notification Channels */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { id: 'push', label: 'Push Notifications', desc: 'Get instant alerts on your device' },
                    { id: 'sms', label: 'SMS Notifications', desc: 'Receive text messages for critical alerts' }
                  ].map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-emerald-100">
                      <div>
                        <p className="font-medium text-gray-800">{channel.label}</p>
                        <p className="text-sm text-gray-600">{channel.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [channel.id]: !notifications[channel.id] })}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications[channel.id] ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications[channel.id] ? 'translate-x-7' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert Types */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Alert Types</h3>
                <div className="space-y-4">
                  {[
                    { id: 'weather', label: 'Weather Alerts', desc: 'Severe weather and forecast updates' },
                    { id: 'yield', label: 'Yield Predictions', desc: 'AI-powered crop yield forecasts' },
                    { id: 'disease', label: 'Disease Detection', desc: 'Crop health and disease warnings' },
                    { id: 'market', label: 'Market Updates', desc: 'Price changes and market trends' }
                  ].map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-emerald-100">
                      <div>
                        <p className="font-medium text-gray-800">{alert.label}</p>
                        <p className="text-sm text-gray-600">{alert.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [alert.id]: !notifications[alert.id] })}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications[alert.id] ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            notifications[alert.id] ? 'translate-x-7' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Preferences</h2>
                <p className="text-gray-600">Customize your experience</p>
              </div>

              {/* Appearance */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Appearance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDarkMode(false)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      !darkMode
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-gray-200 bg-white/50 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <Sun className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-800">Light Mode</p>
                        <p className="text-sm text-gray-600">Bright and clean</p>
                      </div>
                      {!darkMode && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setDarkMode(true)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      darkMode
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-gray-200 bg-white/50 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Moon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-800">Dark Mode</p>
                        <p className="text-sm text-gray-600">Easy on the eyes</p>
                      </div>
                      {darkMode && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Language & Region */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Language & Region</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500">
                      <option>Central Time (CT)</option>
                      <option>Eastern Time (ET)</option>
                      <option>Pacific Time (PT)</option>
                      <option>Mountain Time (MT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Measurement Units</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500">
                      <option>Imperial (acres, lbs)</option>
                      <option>Metric (hectares, kg)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Security Settings</h2>
                <p className="text-gray-600">Manage your account security</p>
              </div>

              {/* Change Password */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                  Update Password
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    Enabled
                  </div>
                </div>
                <button className="px-6 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-all">
                  Manage 2FA
                </button>
              </div>

              {/* Connected Devices */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Connected Devices</h3>
                <div className="space-y-3">
                  {[
                    { device: 'MacBook Pro', location: 'Iowa, US', icon: Monitor, current: true },
                    { device: 'iPhone 13', location: 'Iowa, US', icon: Smartphone, current: false }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.device}</p>
                          <p className="text-sm text-gray-600">{item.location}</p>
                        </div>
                        {item.current && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      {!item.current && (
                        <button className="text-red-500 hover:text-red-700 text-sm font-medium">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="backdrop-blur-lg bg-red-50/60 border border-red-200/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/50 border border-red-200 hover:bg-red-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-red-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Sign Out All Devices</p>
                        <p className="text-sm text-gray-600">Sign out from all devices except this one</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/50 border border-red-200 hover:bg-red-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Delete Account</p>
                        <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Farm Settings Tab */}
          {activeTab === 'farm' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Farm Settings</h2>
                <p className="text-gray-600">Configure your farm preferences</p>
              </div>

              {/* Farm Preferences */}
              <div className="backdrop-blur-lg bg-white/60 border border-white/50 rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-gray-800 mb-4">Farm Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Farm</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500">
                      <option>Green Valley Farm</option>
                      <option>Sunrise Acres</option>
                      <option>Meadow View Farm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Crop Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500">
                      <option>Wheat</option>
                      <option>Rice</option>
                      <option>Corn</option>
                      <option>Soybeans</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farming Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500">
                      <option>Organic</option>
                      <option>Conventional</option>
                      <option>Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Farm Area (acres)</label>
                    <input
                      type="number"
                      defaultValue="250"
                      className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                  Save Farm Settings
                </button>
              </div>
            </div>
          )}
            </div>
        </div>
      </div>
    );
}
