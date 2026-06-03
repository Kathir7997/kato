// src/components/ui/EmptyState.jsx
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
    style={{ background: 'rgba(13,13,31,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
  >
    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 text-4xl animate-float"
      style={{ background: 'linear-gradient(135deg, rgba(var(--rgb-primary),0.15), rgba(var(--rgb-secondary),0.15))', border: '1px solid rgba(var(--rgb-primary),0.2)' }}>
      {icon || '🔗'}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm max-w-xs mb-6" style={{ color: '#64748b' }}>{description}</p>
    {action}
  </motion.div>
);

export default EmptyState;
