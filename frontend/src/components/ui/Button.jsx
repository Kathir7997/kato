// src/components/ui/Button.jsx
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 border border-indigo-500/20',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-md shadow-gray-300/20',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 border border-red-500/20',
  ghost: 'hover:bg-white/10 text-gray-300 hover:text-white border border-transparent',
  gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl shadow-indigo-500/40',
  outline: 'border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 border border-emerald-500/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium',
  md: 'px-5 py-2.5 text-sm font-semibold',
  lg: 'px-7 py-3.5 text-base font-bold',
  xl: 'px-8 py-4 text-lg font-bold',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      whileHover={{ y: disabled || loading ? 0 : -2 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
