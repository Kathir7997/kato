// src/components/ui/Badge.jsx
const variants = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  expired: 'bg-red-50 text-red-600 border border-red-200',
  info: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  gray: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const Badge = ({ children, variant = 'info', className = '' }) => (
  <span className={`
    inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
    ${variants[variant]} ${className}
  `}>
    {(variant === 'active' || variant === 'expired') && (
      <span className={`w-1.5 h-1.5 rounded-full ${variant === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
    )}
    {children}
  </span>
);

export default Badge;
