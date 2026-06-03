// src/pages/DashboardPage.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { urlAPI } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import CreateUrlForm from '../components/dashboard/CreateUrlForm';
import UrlTable from '../components/dashboard/UrlTable';
import { SkeletonCard } from '../components/ui/Skeleton';
import { isExpired } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['urls', search, status, page, sortBy, order],
    queryFn: () =>
      urlAPI.getAll({ search, status, page, limit, sortBy, order }).then((r) => r.data),
    keepPreviousData: true,
  });

  const urls = data?.data || [];
  const pagination = data?.pagination || {};

  const totalUrls = pagination.total || 0;
  const totalClicks = urls.reduce((s, u) => s + (u.clickCount || 0), 0);
  const totalUniqueClicks = urls.reduce((s, u) => s + (u.uniqueClickCount || 0), 0);
  const activeCount = urls.filter((u) => !isExpired(u.expiryDate)).length;
  const expiredCount = urls.filter((u) => isExpired(u.expiryDate)).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgb(var(--rgb-primary-600))' }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </p>
          <h1 className="text-3xl font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>Manage and track all your short URLs</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#10b981' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
          Live Data
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatsCard title="Total URLs" value={totalUrls} color="indigo" index={0}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>}
            />
            <StatsCard title="Total Clicks" value={totalClicks} subText={`${totalUniqueClicks} unique visitors`} color="purple" index={1}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>}
            />
            <StatsCard title="Active Links" value={activeCount} color="emerald" index={2}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
            />
            <StatsCard title="Expired Links" value={expiredCount} color="red" index={3}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
            />
          </>
        )}
      </div>

      {/* Create Form */}
      <CreateUrlForm />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4" style={{ color: '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="input-dark pl-10 pr-4 py-2.5 text-sm w-64"
              placeholder="Search URLs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
            {['', 'active', 'expired'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={status === s
                  ? { background: 'linear-gradient(135deg, rgb(var(--rgb-primary-600)), rgb(var(--rgb-primary-600)))', color: 'white', boxShadow: '0 4px 12px rgba(var(--rgb-primary),0.2)' }
                  : { color: '#475569' }
                }
                onMouseEnter={e => { if (status !== s) e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={e => { if (status !== s) e.currentTarget.style.color = '#475569'; }}
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs font-medium outline-none transition-all"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
            }}
          >
            <option value="createdAt" style={{ background: '#ffffff', color: '#0f172a' }}>Created Date</option>
            <option value="clickCount" style={{ background: '#ffffff', color: '#0f172a' }}>Click Count</option>
            <option value="expiryDate" style={{ background: '#ffffff', color: '#0f172a' }}>Expiry Date</option>
          </select>
          <button
            onClick={() => setOrder((p) => (p === 'desc' ? 'asc' : 'desc'))}
            className="px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200"
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgb(var(--rgb-primary-600))'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            title={`Order: ${order}`}
          >
            {order === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {/* URL Table */}
      <UrlTable urls={urls} loading={isLoading} />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: '#475569' }}>
            Showing {(pagination.page - 1) * limit + 1}–{Math.min(pagination.page * limit, pagination.total)} of {pagination.total} URLs
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-40"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569' }}
            >
              ← Prev
            </button>
            <span className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: '#eef2ff', color: 'rgb(var(--rgb-primary-600))', border: '1px solid rgba(var(--rgb-primary),0.15)' }}>
              {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-40"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569' }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
