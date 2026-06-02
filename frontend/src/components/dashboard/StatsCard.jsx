// src/components/dashboard/StatsCard.jsx
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, subText, icon, color, change, index = 0 }) => {
  const configs = {
    indigo: {
      iconBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      iconShadow: '0 8px 20px rgba(99,102,241,0.2)',
      borderColor: '#e2e8f0',
      accentColor: '#6366f1',
      chartHeights: [0.3, 0.5, 0.8, 0.4, 0.9, 0.6, 0.7],
    },
    purple: {
      iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      iconShadow: '0 8px 20px rgba(168,85,247,0.2)',
      borderColor: '#e2e8f0',
      accentColor: '#a855f7',
      chartHeights: [0.4, 0.7, 0.5, 0.9, 0.3, 0.8, 0.6],
    },
    emerald: {
      iconBg: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
      iconShadow: '0 8px 20px rgba(16,185,129,0.2)',
      borderColor: '#e2e8f0',
      accentColor: '#10b981',
      chartHeights: [0.5, 0.3, 0.6, 0.8, 0.4, 0.7, 0.9],
    },
    red: {
      iconBg: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      iconShadow: '0 8px 20px rgba(239,68,68,0.2)',
      borderColor: '#e2e8f0',
      accentColor: '#ef4444',
      chartHeights: [0.6, 0.8, 0.3, 0.5, 0.9, 0.4, 0.7],
    },
  };

  const c = configs[color] || configs.indigo;

  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      className="rounded-2xl p-6 card-hover relative overflow-hidden cursor-default group"
      style={{
        background: '#ffffff',
        border: `1px solid ${c.borderColor}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${c.accentColor}05 0%, transparent 100%)`,
        }}
      />

      <div className="flex items-start justify-between mb-4 relative z-10">
        {/* Icon */}
        <motion.div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
          style={{
            background: c.iconBg,
            boxShadow: c.iconShadow,
          }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>

        {/* Change Badge */}
        {change !== undefined && (
          <motion.span
            className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            style={{
              background: change >= 0 ? '#ecfdf5' : '#fef2f2',
              color: change >= 0 ? '#10b981' : '#ef4444',
              border: `1px solid ${change >= 0 ? '#a7f3d0' : '#fca5a5'}`,
            }}
          >
            {change >= 0 ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L1 10m6-6l6 6" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l6 6m0 0l-6 6m6-6H7v8" />
              </svg>
            )}
            <span>{Math.abs(change)}%</span>
          </motion.span>
        )}
      </div>

      {/* Content */}
      <div className="flex items-end justify-between mt-2 relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>
            {title}
          </p>
          <motion.p
            className="text-3xl font-black text-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {value?.toLocaleString() ?? '—'}
          </motion.p>
          {subText && (
            <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-none">
              {subText}
            </p>
          )}
        </div>

        {/* Mini bar chart matching reference */}
        <div className="flex items-end gap-1 h-9 pb-1 flex-shrink-0">
          {c.chartHeights.map((heightPct, idx) => (
            <motion.div
              key={idx}
              className="w-1 rounded-full"
              style={{
                height: `${heightPct * 100}%`,
                background: c.accentColor,
                opacity: 0.65,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: index * 0.1 + idx * 0.05 + 0.3,
                duration: 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
