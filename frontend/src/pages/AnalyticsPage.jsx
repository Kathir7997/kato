// src/pages/AnalyticsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { analyticsAPI } from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { SkeletonChart, SkeletonCard } from '../components/ui/Skeleton';
import { formatDate, timeAgo, CHART_COLORS, isExpired } from '../utils/helpers';

// ── Mini Stat Card ──────────────────────────────────────────────────────
const AnalyticsCard = ({ title, value, sub, icon, index, color = 'indigo' }) => {
  const configs = {
    indigo: { bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', text: '#6366f1' },
    purple: { bg: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', text: '#a855f7' },
    emerald: { bg: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', text: '#10b981' },
    amber: { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', text: '#d97706' }
  };
  const c = configs[color] || configs.indigo;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.05)] transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: c.bg }}>
          {icon}
        </div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>{title}</p>
      </div>
      <p className="text-3xl font-black text-slate-800">{value ?? '—'}</p>
      {sub && <p className="text-xs text-slate-400 mt-1.5 font-medium">{sub}</p>}
    </motion.div>
  );
};

// ── Chart Container ─────────────────────────────────────────────────────
const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
    <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

// ── Custom Tooltip ──────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] rounded-xl px-4 py-3 text-xs">
      <p className="font-bold text-slate-800 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', id],
    queryFn: () => analyticsAPI.get(id).then((r) => r.data.data),
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500 font-medium">Failed to load analytics</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>← Back to Dashboard</Button>
      </div>
    );
  }

  const { url, summary, dailyTrend, deviceData, browserData, countryData, recentVisits } = data || {};
  const expired = url ? isExpired(url.expiryDate) : false;
  const shortUrl = url?.shortUrl || '';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-black text-slate-800 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>URL Analytics</h1>
          {url && (
            <div className="flex items-center gap-2 mt-1.5">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-2 decoration-indigo-200 hover:decoration-indigo-500 transition-all"
              >
                {shortUrl}
              </a>
              <Badge variant={expired ? 'expired' : 'active'}>
                {expired ? 'Expired' : 'Active'}
              </Badge>
            </div>
          )}
          {url && (
            <p className="text-xs text-slate-400 mt-1 max-w-xl truncate">
              → {url.originalUrl}
            </p>
          )}
        </div>
        {url && (
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-slate-400">Created</p>
            <p className="text-sm font-semibold text-slate-700">{formatDate(url.createdAt)}</p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard title="Total Clicks" value={summary?.totalClicks?.toLocaleString()} index={0} color="indigo"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>}
          />
          <AnalyticsCard title="Unique Visitors" value={summary?.uniqueVisitors?.toLocaleString()} index={1} color="purple"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>}
          />
          <AnalyticsCard title="Last Visit" value={summary?.lastVisit ? timeAgo(summary.lastVisit) : 'Never'} color="emerald"
            sub={summary?.lastVisit ? formatDate(summary.lastVisit) : undefined} index={2}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
          />
          <AnalyticsCard title="Avg Clicks / Day" value={summary?.avgClicksPerDay} index={3} color="amber"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>}
          />
        </div>
      )}

      {/* Charts Row 1 */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><SkeletonChart /></div>
          <SkeletonChart />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Daily Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ChartCard title="📈 Daily Click Trend (Last 30 Days)">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dailyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(v) => v.split('-').slice(1).join('/')} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="clicks" name="Clicks"
                    stroke="#6366f1" strokeWidth={2.5} dot={false}
                    activeDot={{ r: 5, fill: '#6366f1' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Device Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <ChartCard title="📱 Device Distribution">
              {deviceData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={deviceData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                      dataKey="value" nameKey="name" paddingAngle={3}>
                      {deviceData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm font-medium">No data yet</div>
              )}
            </ChartCard>
          </motion.div>
        </div>
      )}

      {/* Charts Row 2 */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Browser Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ChartCard title="🌐 Browser Distribution">
              {browserData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={browserData} cx="50%" cy="50%" outerRadius={80}
                      dataKey="value" nameKey="name" paddingAngle={2}>
                      {browserData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm font-medium">No data yet</div>
              )}
            </ChartCard>
          </motion.div>

          {/* Country Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <ChartCard title="🌍 Top Countries">
              {countryData?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={countryData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                    <YAxis type="category" dataKey="country" tick={{ fontSize: 10, fill: '#64748b' }} width={60} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="clicks" name="Clicks" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm font-medium">No data yet</div>
              )}
            </ChartCard>
          </motion.div>
        </div>
      )}

      {/* Recent Visits Table */}
      {!isLoading && recentVisits?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">🕐 Recent Visits</h3>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{recentVisits.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75">
                    {['Date', 'Time', 'Browser', 'Device', 'OS', 'Country', 'City'].map((h) => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentVisits.map((v, i) => (
                    <motion.tr key={v._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }} className="table-row-hover hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {v.timestamp ? new Date(v.timestamp).toLocaleDateString() : v.date}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {v.timestamp ? new Date(v.timestamp).toLocaleTimeString() : v.time}
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-semibold">{v.browser}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          v.device === 'Mobile' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                          v.device === 'Tablet' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {v.device}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">{v.os}</td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{v.country}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs font-medium">{v.city}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsPage;
