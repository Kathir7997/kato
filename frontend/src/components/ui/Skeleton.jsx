// src/components/ui/Skeleton.jsx
// Loading skeleton components for shimmer effect — dark theme

export const SkeletonLine = ({ className = '' }) => (
  <div className={`skeleton h-4 rounded ${className}`} />
);

export const SkeletonCard = () => (
  <div className="rounded-2xl p-5 space-y-4"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="flex items-center justify-between">
      <div className="skeleton w-11 h-11 rounded-2xl" />
    </div>
    <div className="space-y-2">
      <div className="skeleton h-3 rounded-full" style={{ width: '50%' }} />
      <div className="skeleton h-9 rounded-lg" style={{ width: '60%' }} />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="skeleton h-4 rounded-full" style={{ width: `${50 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="rounded-2xl overflow-hidden"
    style={{ background: 'rgba(13,13,31,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="skeleton h-4 rounded-full w-48" />
    </div>
    <table className="w-full">
      <tbody>
        {[...Array(rows)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonChart = () => (
  <div className="rounded-2xl p-5"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="skeleton h-4 rounded-full w-40 mb-4" />
    <div className="skeleton rounded-xl" style={{ height: '200px' }} />
  </div>
);
