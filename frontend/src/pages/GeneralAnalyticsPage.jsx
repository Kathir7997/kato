import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { urlAPI } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import { SkeletonCard, SkeletonChart } from '../components/ui/Skeleton';
import { CHART_COLORS } from '../utils/helpers';

const GeneralAnalyticsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['urls', 'all-analytics'],
    queryFn: () => urlAPI.getAll({ limit: 100, sortBy: 'clickCount', order: 'desc' }).then((r) => r.data),
  });

  const urls = data?.data || [];
  
  const totalClicks = urls.reduce((s, u) => s + (u.clickCount || 0), 0);
  const totalUniqueClicks = urls.reduce((s, u) => s + (u.uniqueClickCount || 0), 0);
  const topUrls = urls.slice(0, 10).map(u => ({
    name: u.shortCode || u.shortUrl?.split('/').pop(),
    clicks: u.clickCount || 0,
    originalUrl: u.originalUrl
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Overview Analytics
        </h1>
        <p className="text-sm mt-1 text-slate-500">Aggregate statistics across all your URLs</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatsCard title="Total Network Clicks" value={totalClicks} color="indigo"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>}
            />
            <StatsCard title="Total Unique Visitors" value={totalUniqueClicks} color="purple"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>}
            />
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
      >
        <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Top 10 Performing URLs</h3>
        {isLoading ? (
          <SkeletonChart />
        ) : topUrls.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topUrls} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="clicks" radius={[6, 6, 0, 0]}>
                  {topUrls.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400">
            No data available yet
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GeneralAnalyticsPage;
