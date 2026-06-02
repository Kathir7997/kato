// src/pages/BulkUploadPage.jsx
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { urlAPI } from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const BulkUploadPage = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setResults(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => toast.error('Please upload a valid CSV file (max 5MB)'),
  });

  const mutation = useMutation({
    mutationFn: (formData) => urlAPI.bulkUpload(formData),
    onSuccess: (res) => {
      setResults(res.data.data);
      toast.success(res.data.message);
      setFile(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Upload failed');
    },
  });

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    mutation.mutate(formData);
  };

  const successCount = results?.filter((r) => r.success).length || 0;
  const failCount = results?.filter((r) => !r.success).length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Bulk URL Shortening</h1>
        <p className="text-sm text-slate-500 mt-1">Upload a CSV file to shorten multiple URLs at once</p>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-indigo-50/40 to-purple-50/40 border border-indigo-100/80 rounded-2xl p-6 shadow-[0_8px_30px_rgb(99,102,241,0.02)]">
        <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3">📋 CSV Format Requirements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-indigo-800">
          <div>
            <p className="font-bold">Column 1 (Required)</p>
            <p className="text-indigo-500 mt-0.5">OriginalURL</p>
          </div>
          <div>
            <p className="font-bold">Column 2 (Optional)</p>
            <p className="text-indigo-500 mt-0.5">CustomAlias</p>
          </div>
          <div>
            <p className="font-bold">Column 3 (Optional)</p>
            <p className="text-indigo-500 mt-0.5">ExpiryDate (YYYY-MM-DD)</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white/80 border border-indigo-100/50 rounded-xl font-mono text-xs text-slate-600">
          <p className="text-slate-400 mb-1.5 font-bold">Example CSV:</p>
          <p>OriginalURL,CustomAlias,ExpiryDate</p>
          <p>https://google.com,google,2025-12-31</p>
          <p>https://github.com,,</p>
        </div>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-indigo-500 bg-indigo-50/40 shadow-[0_12px_40px_rgba(99,102,241,0.05)]' : 'border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:border-indigo-300 hover:bg-indigo-50/10'}
          ${file ? 'border-emerald-400 bg-emerald-50/20' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {file ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-md">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-emerald-800 text-sm">{file.name}</p>
                <p className="text-xs text-emerald-600 mt-0.5">{(file.size / 1024).toFixed(1)} KB • Ready to upload</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-xs text-slate-400 hover:text-red-500 underline transition-colors font-medium"
              >
                Remove file
              </button>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-slate-700 font-semibold text-sm">
                  {isDragActive ? 'Drop your CSV here' : 'Drag & drop your CSV file'}
                </p>
                <p className="text-xs text-slate-400 mt-1">or click to browse • Max 5MB • .csv only</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Button */}
      {file && (
        <Button
          variant="gradient"
          size="lg"
          className="w-full"
          loading={mutation.isPending}
          onClick={handleUpload}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {mutation.isPending ? 'Processing CSV...' : `Upload & Shorten ${file.name}`}
        </Button>
      )}

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-5 text-center shadow-[0_8px_30px_rgb(16,185,129,0.01)] animate-fade-in-scale">
                <p className="text-3xl font-black text-emerald-600">{successCount}</p>
                <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide mt-1.5">Successfully Created</p>
              </div>
              <div className="bg-red-50/40 border border-red-100/80 rounded-2xl p-5 text-center shadow-[0_8px_30px_rgb(239,68,68,0.01)] animate-fade-in-scale">
                <p className="text-3xl font-black text-red-500">{failCount}</p>
                <p className="text-xs text-red-600 font-bold uppercase tracking-wide mt-1.5">Failed / Skipped</p>
              </div>
            </div>

            {/* Result Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Processing Results</h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{results.length} urls</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-100">
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Original URL</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Short URL</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((r, i) => (
                      <tr key={i} className="table-row-hover hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 max-w-[200px] text-slate-600 truncate text-xs font-medium">{r.originalUrl}</td>
                        <td className="px-6 py-4">
                          {r.shortUrl ? (
                            <a href={r.shortUrl} target="_blank" rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold underline decoration-2 decoration-indigo-100 hover:decoration-indigo-500 transition-all">
                              {r.shortUrl}
                            </a>
                          ) : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={r.success ? 'active' : 'expired'}>
                            {r.success ? 'Created' : 'Failed'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs text-red-500 font-medium">{r.error || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkUploadPage;
