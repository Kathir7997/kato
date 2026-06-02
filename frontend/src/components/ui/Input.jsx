// src/components/ui/Input.jsx
import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helpText,
  className = '',
  containerClass = '',
  prefix,
  suffix,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClass}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div
        className={`
          flex items-center w-full px-3 py-2.5 text-sm rounded-lg border transition-all duration-150 bg-white
          focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500
          ${error ? 'border-red-400 focus-within:ring-red-300/30 focus-within:border-red-400' : 'border-gray-200 hover:border-gray-300'}
        `}
      >
        {prefix && (
          <span className="text-gray-500 text-sm select-none pr-0.5 flex-shrink-0 font-medium">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-transparent text-gray-900 placeholder:text-gray-400
            outline-none border-none p-0 focus:ring-0 focus:outline-none
            disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {suffix && (
          <span className="text-gray-400 text-sm select-none pl-2 ml-2 border-l border-gray-200 flex-shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helpText && !error && <p className="text-xs text-gray-400">{helpText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
