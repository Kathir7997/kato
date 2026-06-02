// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { urlAPI } from '../../services/api';
import ProfileSettingsModal from '../shared/ProfileSettingsModal';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const { data: urlsData } = useQuery({
    queryKey: ['notifications-urls'],
    queryFn: () => urlAPI.getAll({ limit: 100 }).then((r) => r.data.data),
    refetchInterval: 60 * 1000,
    enabled: !!user,
  });

  const expiringUrls = (urlsData || []).filter((url) => {
    if (!url.expiryDate) return false;
    const expiryTime = new Date(url.expiryDate).getTime();
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    return expiryTime > now && (expiryTime - now) <= oneDayMs;
  });

  const getExpiresIn = (dateString) => {
    if (!dateString) return '—';
    const diff = new Date(dateString).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m`;
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 flex-shrink-0 relative group"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      {/* Left Section: Toggle + Breadcrumb */}
      <div className="flex items-center gap-4 relative z-10">
        <motion.button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-lg transition-all duration-200"
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#475569',
          }}
          whileHover={{
            background: '#f1f5f9',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
          title="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>

        {/* Breadcrumb */}
        <motion.div
          className="hidden md:flex items-center gap-2.5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">KatoShort</p>
              <p className="text-xs" style={{ color: '#64748b' }}>URL Shortener</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="hidden lg:flex items-center relative max-w-md w-full mx-8">
        <svg className="w-4 h-4 absolute left-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search URLs, analytics or settings..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl outline-none transition-all"
          style={{
            background: '#f1f5f9',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
          }}
        />
      </div>

      {/* Right Section: Status + Actions + User */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Live Status Badge */}
        <motion.div
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full"
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
          }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ background: '#10b981' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-bold" style={{ color: '#10b981' }}>System Online</span>
        </motion.div>

        {/* Notification Bell */}
        <div className="relative">
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-lg transition-all duration-200 relative"
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
            }}
            whileHover={{
              background: '#f1f5f9',
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification dot */}
            {expiringUrls.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: '#ef4444' }}
              />
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 rounded-xl p-3 z-50"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                }}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                  {expiringUrls.length > 0 && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      {expiringUrls.length} expiring soon
                    </span>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5">
                  {expiringUrls.length > 0 ? (
                    expiringUrls.map((url) => (
                      <div
                        key={url._id}
                        onClick={() => {
                          setShowNotifications(false);
                          navigate(`/analytics/${url._id}`);
                        }}
                        className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors flex items-start gap-2.5 cursor-pointer text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">/{url.shortCode}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{url.originalUrl}</p>
                          <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            Expires in {getExpiresIn(url.expiryDate)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs font-medium">
                      🔔 No expiring links today
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Section */}
        <div className="relative">
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200"
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
            }}
            whileHover={{
              background: '#f1f5f9',
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Avatar */}
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.2)',
              }}
              whileHover={{ scale: 1.1 }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </motion.div>

            {/* User Info */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
            </div>

            {/* Dropdown indicator */}
            <motion.svg
              className="w-4 h-4 hidden sm:block"
              style={{ color: '#475569' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              animate={{ rotate: showUserMenu ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </motion.button>

          {/* Dropdown Menu */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={showUserMenu ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-xl p-2 z-50"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              pointerEvents: showUserMenu ? 'auto' : 'none',
            }}
          >
            <motion.button
              onClick={() => {
                setShowProfileSettings(true);
                setShowUserMenu(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ color: '#475569' }}
              whileHover={{
                background: '#f8fafc',
                color: '#0f172a',
              }}
            >
              Profile Settings
            </motion.button>
            <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />
            <motion.button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ color: '#ef4444' }}
              whileHover={{
                background: 'rgba(239,68,68,0.05)',
                color: '#ef4444',
              }}
            >
              Sign Out
            </motion.button>
          </motion.div>
        </div>
      </div>
      <ProfileSettingsModal
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
      />
    </header>
  );
};

export default Navbar;
