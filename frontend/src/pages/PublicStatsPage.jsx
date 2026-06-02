// src/pages/PublicStatsPage.jsx
// Public-facing stats page accessible without authentication

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import Badge from '../components/ui/Badge';
import { formatDate, timeAgo, downloadDataURI } from '../utils/helpers';

const PublicStatsPage = () => {
  const { shortCode } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-stats', shortCode],
    queryFn: () => publicAPI.getStats(shortCode).then((r) => r.data.data),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="auth-bg flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-bg flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
          <p className="text-gray-500 text-sm">This short URL doesn't exist or has been removed.</p>
          <a href="/" className="mt-6 inline-block text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            ← Back to KatoShort
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">KatoShort</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Public URL Stats</h1>
          <p className="text-gray-400 text-sm mt-1">/{shortCode}</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 space-y-6"
        >
          {/* Status */}
          <div className="flex items-center justify-between">
            <Badge variant={data.isExpired ? 'expired' : 'active'}>
              {data.isExpired ? 'Expired' : 'Active'}
            </Badge>
            <span className="text-xs text-gray-400">Created {formatDate(data.createdAt)}</span>
          </div>

          {/* Short URL */}
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs text-indigo-400 mb-1">Short URL</p>
            <a
              href={data.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-700 font-semibold hover:text-indigo-900 break-all transition-colors"
            >
              {data.shortUrl}
            </a>
          </div>

          {/* Expired Banner */}
          {data.isExpired && (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-700">Link Expired</p>
                <p className="text-xs text-red-500">Expired on {formatDate(data.expiryDate)}</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xl font-bold text-indigo-600">{data.clickCount?.toLocaleString() || 0}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Total Clicks</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-xl font-bold text-purple-600">{data.uniqueClickCount?.toLocaleString() || 0}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Unique Visits</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-[11px] font-bold text-gray-700 mt-1">{formatDate(data.createdAt)}</p>
              <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider font-semibold">Created</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-[11px] font-bold text-gray-700 mt-1">
                {data.lastVisit ? timeAgo(data.lastVisit) : 'Never'}
              </p>
              <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider font-semibold">Last Visit</p>
            </div>
          </div>

          {/* QR Code */}
          {data.qrCode && (
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <img src={data.qrCode} alt="QR Code" className="w-40 h-40 rounded-xl" />
              </div>
              <button
                onClick={() => downloadDataURI(data.qrCode, `qr-${shortCode}.png`)}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR Code
              </button>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by <span className="text-indigo-600 font-medium">KatoShort</span> • katomaran.com
        </p>
      </div>
    </div>
  );
};

export default PublicStatsPage;
