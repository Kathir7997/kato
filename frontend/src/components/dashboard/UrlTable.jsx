// src/components/dashboard/UrlTable.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import EmptyState from '../ui/EmptyState';
import QRModal from '../shared/QRModal';
import EditUrlModal from '../shared/EditUrlModal';
import ConfirmModal from '../shared/ConfirmModal';
import { urlAPI } from '../../services/api';
import { copyToClipboard, truncate, formatDate, isExpired } from '../../utils/helpers';

const UrlTable = ({ urls = [], loading = false }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [qrUrl, setQrUrl] = useState(null);
  const [editUrl, setEditUrl] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => urlAPI.delete(id),
    onSuccess: () => {
      toast.success('URL deleted');
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Delete failed');
    },
  });

  const handleCopy = async (shortUrl) => {
    const ok = await copyToClipboard(shortUrl);
    if (ok) toast.success('Copied to clipboard!');
    else toast.error('Failed to copy');
  };

  if (!loading && urls.length === 0) {
    return (
      <EmptyState
        icon="🔗"
        title="No URLs yet"
        description="Create your first short URL using the form above and start tracking clicks."
      />
    );
  }

  const ActionBtn = ({ onClick, title, colorHover, children }) => (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg transition-all duration-150"
      style={{ color: '#475569', background: 'transparent' }}
      onMouseEnter={e => {
        e.currentTarget.style.color = colorHover.color;
        e.currentTarget.style.background = colorHover.bg;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = '#475569';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );

  return (
    <>
      <div className="rounded-2xl overflow-hidden"
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Original URL', 'Short URL', 'Created', 'Expiry', 'Clicks', 'Status', 'Actions'].map((h, i) => (
                  <th key={h}
                    className={`${i === 6 ? 'text-right' : 'text-left'} px-4 py-3.5 font-semibold text-xs uppercase tracking-widest`}
                    style={{ color: '#64748b' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ divideColor: '#edf2f7' }}>
              <AnimatePresence>
                {urls.map((url, i) => {
                  const expired = isExpired(url.expiryDate);
                  const shortUrl = url.shortUrl || `${import.meta.env.VITE_BASE_URL}/${url.shortCode}`;

                  return (
                    <motion.tr
                      key={url._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.04 }}
                      className="table-row-hover"
                      style={{ borderBottom: '1px solid #e2e8f0' }}
                    >
                      {/* Original URL */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate block transition-colors text-xs"
                          style={{ color: '#475569', maxWidth: '200px' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'rgb(var(--rgb-primary-600))'}
                          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                          title={url.originalUrl}
                        >
                          {truncate(url.originalUrl, 40)}
                        </a>
                      </td>

                      {/* Short URL */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sm transition-colors"
                            style={{ color: 'rgb(var(--rgb-primary-600))' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgb(var(--rgb-primary))'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgb(var(--rgb-primary-600))'}
                          >
                            /{url.shortCode}
                          </a>
                          <button
                            onClick={() => handleCopy(shortUrl)}
                            className="p-1 rounded transition-all duration-150"
                            style={{ color: '#64748b' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'rgb(var(--rgb-primary-600))'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
                            title="Copy"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3.5 text-xs" style={{ color: '#64748b' }}>{formatDate(url.createdAt)}</td>

                      {/* Expiry */}
                      <td className="px-4 py-3.5 text-xs">
                        {url.expiryDate ? (
                          <span style={{ color: expired ? '#ef4444' : '#64748b' }}>{formatDate(url.expiryDate)}</span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>No expiry</span>
                        )}
                      </td>

                      {/* Clicks */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm" style={{ color: '#334155' }}>
                            {url.clickCount?.toLocaleString() || 0}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                            {url.uniqueClickCount?.toLocaleString() || 0} unique
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className="chip"
                          style={{
                            background: expired ? '#fef2f2' : '#ecfdf5',
                            color: expired ? '#ef4444' : '#10b981',
                            border: `1px solid ${expired ? '#fca5a5' : '#a7f3d0'}`,
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full"
                            style={{ background: expired ? '#ef4444' : '#10b981', display: 'inline-block' }} />
                          {expired ? 'Expired' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-0.5">
                          <ActionBtn onClick={() => handleCopy(shortUrl)} title="Copy URL"
                            colorHover={{ color: 'rgb(var(--rgb-primary-600))', bg: '#f0f2ff' }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </ActionBtn>

                          <ActionBtn onClick={() => setQrUrl(url)} title="View QR Code"
                            colorHover={{ color: 'rgb(var(--rgb-primary-600))', bg: '#f5f3ff' }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                          </ActionBtn>

                          <ActionBtn onClick={() => navigate(`/analytics/${url._id}`)} title="View Analytics"
                            colorHover={{ color: '#2563eb', bg: '#eff6ff' }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </ActionBtn>

                          <ActionBtn onClick={() => setEditUrl(url)} title="Edit"
                            colorHover={{ color: '#d97706', bg: '#fffbeb' }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </ActionBtn>

                          <ActionBtn onClick={() => setDeleteId(url._id)} title="Delete"
                            colorHover={{ color: '#dc2626', bg: '#fef2f2' }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </ActionBtn>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <QRModal isOpen={!!qrUrl} onClose={() => setQrUrl(null)} url={qrUrl} />
      <EditUrlModal isOpen={!!editUrl} onClose={() => setEditUrl(null)} url={editUrl} />
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="Delete URL"
        message="Are you sure you want to delete this URL? All analytics data will be permanently removed. This action cannot be undone."
        confirmLabel="Yes, Delete"
      />
    </>
  );
};

export default UrlTable;
