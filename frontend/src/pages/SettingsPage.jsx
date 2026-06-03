import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI, urlAPI } from '../services/api';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const SettingsPage = () => {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  
  // API State
  const [apiKey, setApiKey] = useState('');

  // Appearance State
  const [theme, setTheme] = useState('indigo');

  // Notifications State
  const [notifications, setNotifications] = useState({
    weeklyReport: true,
    expiryAlerts: true
  });

  // Security State
  const [spamProtection, setSpamProtection] = useState(true);

  // Data & Privacy State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
      if (user.settings?.spamProtection !== undefined) {
        setSpamProtection(user.settings.spamProtection);
      }
      if (user.settings?.theme !== undefined) {
        setTheme(user.settings.theme);
      }
      if (user.settings?.notifications !== undefined) {
        setNotifications(user.settings.notifications);
      }
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(
      form.name.trim(),
      form.email.trim(),
      form.password || undefined,
      user.settings // Keep existing settings
    );
    setLoading(false);
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(
      undefined,
      undefined,
      undefined,
      { ...user.settings, spamProtection, theme, notifications }
    );
    // Apply dynamic theme immediately (basic implementation)
    document.documentElement.setAttribute('data-theme', theme);
    setLoading(false);
  };

  const handleGenerateApiKey = async () => {
    try {
      setLoading(true);
      const res = await authAPI.generateApiKey();
      setApiKey(res.data.apiKey);
      toast.success('New API Key generated successfully!');
    } catch (err) {
      toast.error('Failed to generate API Key');
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API Key copied to clipboard!');
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const response = await urlAPI.exportUrls();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'kato-urls-export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Data exported successfully!');
    } catch (err) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteInput !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    
    try {
      setLoading(true);
      await deleteAccount();
      logout();
      toast.success('Your account has been deleted');
    } catch (err) {
      toast.error('Failed to delete account');
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Edition', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'api', label: 'Developer API', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { id: 'appearance', label: 'Appearance', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'security', label: 'Security & Spam', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'data', label: 'Data & Privacy', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Settings
        </h1>
        <p className="text-sm mt-1 text-slate-500">Manage your profile and account preferences</p>
      </motion.div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50/50 border-r border-slate-100 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Edition</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-md">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
                <div className="pt-2">
                  <Input
                    label="New Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    helpText="Leave blank to keep your current password"
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit" variant="gradient" className="w-full sm:w-auto px-8" loading={loading}>
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Developer API Tab */}
          {activeTab === 'api' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Developer API</h2>
              <div className="space-y-6 max-w-2xl">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">API Access</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                    Generate an API key to securely interact with the platform from your own applications. 
                    Include this key in the <code className="bg-slate-200 px-1 rounded">X-API-Key</code> header of your requests.
                  </p>
                  
                  {apiKey ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                        New API Key generated successfully! Please copy it now, you will not be able to see it again.
                      </p>
                      <div className="flex gap-2">
                        <Input value={apiKey} readOnly className="flex-1 font-mono text-sm" />
                        <Button type="button" onClick={copyApiKey} variant="secondary">Copy</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-3 bg-white p-3 rounded-lg border border-slate-200">
                        Warning: Generating a new key will immediately invalidate any previously generated keys.
                      </p>
                      <Button onClick={handleGenerateApiKey} variant="primary" loading={loading}>
                        Generate New API Key
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Appearance</h2>
              <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-md">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Primary Accent Color</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'indigo', name: 'Indigo', color: 'bg-indigo-500' },
                      { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
                      { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
                      { id: 'amber', name: 'Amber', color: 'bg-amber-500' },
                      { id: 'cyan', name: 'Cyan', color: 'bg-cyan-500' },
                      { id: 'fuchsia', name: 'Fuchsia', color: 'bg-fuchsia-500' },
                      { id: 'ocean', name: 'Ocean', color: 'bg-sky-500' },
                      { id: 'sunset', name: 'Sunset', color: 'bg-orange-500' },
                      { id: 'midnight', name: 'Midnight', color: 'bg-slate-800' }
                    ].map(t => (
                      <div 
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`cursor-pointer p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${theme === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        <div className={`w-6 h-6 rounded-full ${t.color}`}></div>
                        <span className="text-sm font-semibold text-slate-700">{t.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Choose the primary color theme that will be used throughout your dashboard interface.
                  </p>
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary" className="w-full sm:w-auto px-8" loading={loading}>
                    Save Appearance
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Notifications</h2>
              <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-2xl">
                
                <div className="space-y-4">
                  {/* Weekly Report */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Weekly Analytics Report</h3>
                      <p className="text-xs text-slate-500 mt-1">Receive a weekly email digest summarizing your link clicks and performance.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.weeklyReport}
                        onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>

                  {/* Expiry Alerts */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Expiration Alerts</h3>
                      <p className="text-xs text-slate-500 mt-1">Get notified when one of your active short links is about to expire.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.expiryAlerts}
                        onChange={(e) => setNotifications({ ...notifications, expiryAlerts: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" className="w-full sm:w-auto px-8" loading={loading}>
                    Save Notification Preferences
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Security & Spam</h2>
              <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-2xl">
                
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800">Spam & Malware Protection</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">
                      Automatically blocks the creation of short URLs that point to known malware, phishing, or spam websites. We highly recommend keeping this enabled to protect your reputation and visitors.
                    </p>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={spamProtection}
                        onChange={(e) => setSpamProtection(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-semibold text-slate-700">
                        {spamProtection ? 'Enabled (Recommended)' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" className="w-full sm:w-auto px-8" loading={loading}
                    disabled={user?.settings?.spamProtection === spamProtection}
                  >
                    Save Security Preferences
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Data & Privacy Tab */}
          {activeTab === 'data' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Data & Privacy</h2>
              <div className="space-y-6 max-w-2xl">
                
                {/* Export Data */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">Export Your Data</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Download a complete CSV backup of all your shortened URLs, including their created dates, click counts, and status.
                  </p>
                  <Button onClick={handleExportData} variant="secondary" loading={loading}>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download CSV
                    </div>
                  </Button>
                </div>

                {/* Delete Account */}
                <div className="bg-red-50/50 border border-red-100 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-red-600">Danger Zone: Delete Account</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Once you delete your account, there is no going back. All of your short links will stop working immediately, and your analytics data will be permanently erased.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete My Account
                    </button>
                  ) : (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-white rounded-lg border border-red-100 shadow-sm"
                      onSubmit={handleDeleteAccount}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        To verify, type <span className="font-bold text-red-600">DELETE</span> below:
                      </label>
                      <Input
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="DELETE"
                        className="mb-4"
                        required
                      />
                      <div className="flex gap-3">
                        <Button type="submit" variant="primary" className="bg-red-600 hover:bg-red-700 w-full" loading={loading} disabled={deleteInput !== 'DELETE'}>
                          Permanently Delete
                        </Button>
                        <Button type="button" variant="secondary" className="w-full" onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteInput('');
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </div>

              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
