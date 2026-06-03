// src/components/dashboard/CreateUrlForm.jsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { urlAPI } from '../../services/api';

const CreateUrlForm = () => {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ originalUrl: '', customAlias: '', expiryDate: '' });
  const [focused, setFocused] = useState(null);

  const mutation = useMutation({
    mutationFn: (data) => urlAPI.create(data),
    onSuccess: () => {
      toast.success('✨ Short URL created successfully!', {
        icon: '🎉',
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      setForm({ originalUrl: '', customAlias: '', expiryDate: '' });
      setExpanded(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create URL');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.originalUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    mutation.mutate({
      originalUrl: form.originalUrl,
      customAlias: form.customAlias || undefined,
      expiryDate: form.expiryDate || undefined,
    });
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={formVariants}
      className="rounded-2xl overflow-hidden relative group"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(var(--rgb-primary),0.01) 0%, rgba(var(--rgb-secondary),0.01) 100%)',
        }}
      />

      {/* Header Section */}
      <div className="px-6 py-6 relative border-b border-gray-100"
        style={{
          background: '#f8fafc',
        }}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <motion.h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: 'rgb(var(--rgb-primary))' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Create a Short URL
            </motion.h2>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>
              Paste your long URL and get a trackable, shortened link instantly
            </p>
          </div>
          <motion.div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-4"
            style={{
              background: 'linear-gradient(135deg, rgb(var(--rgb-primary)) 0%, rgb(var(--rgb-secondary)) 50%, rgb(var(--rgb-secondary)) 100%)',
              boxShadow: '0 4px 12px rgba(var(--rgb-primary),0.2)',
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-8 space-y-8 relative z-10">
        {/* Main URL Input */}
        <div className="space-y-3">
          <label className="block text-sm font-bold tracking-wide" style={{ color: '#475569' }}>
            Long URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 transition-colors duration-200"
                style={{ color: focused === 'url' ? 'rgb(var(--rgb-primary))' : '#64748b' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              className="input-dark w-full pl-14 pr-4 py-3.5 text-sm"
              placeholder="https://example.com/very/long/url/with/parameters"
              value={form.originalUrl}
              onChange={(e) => setForm((p) => ({ ...p, originalUrl: e.target.value }))}
              onFocus={() => setFocused('url')}
              onBlur={() => setFocused(null)}
              required
              type="url"
            />
          </div>
          <p className="text-xs mt-2" style={{ color: '#64748b' }}>
            Enter your long URL to generate a short, shareable link
          </p>
        </div>

        {/* Advanced Options Toggle */}
        <motion.button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          className="flex items-center gap-3 text-sm font-semibold transition-all duration-200 group mt-2"
          style={{ color: expanded ? 'rgb(var(--rgb-primary-600))' : 'rgb(var(--rgb-primary))' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgb(var(--rgb-primary-600))'}
          onMouseLeave={e => e.currentTarget.style.color = expanded ? 'rgb(var(--rgb-primary-600))' : 'rgb(var(--rgb-primary))'}
          whileHover={{ x: 2 }}
          whileTap={{ x: 0 }}
        >
          <motion.svg
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </motion.svg>
          <span>{expanded ? 'Hide' : 'Show'} advanced options</span>
        </motion.button>

        {/* Advanced Options */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-gray-100 space-y-6">
                {/* Custom Alias */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold tracking-wide" style={{ color: '#475569' }}>
                    Custom Alias (Optional)
                  </label>
                  <div className="relative flex items-center w-full input-dark overflow-hidden"
                    style={{
                      border: focused === 'alias' ? '1.5px solid rgba(var(--rgb-primary),0.8)' : '1.5px solid rgba(var(--rgb-primary),0.15)',
                      boxShadow: focused === 'alias' ? '0 0 0 4px rgba(var(--rgb-primary),0.15), 0 8px 20px rgba(var(--rgb-primary),0.2)' : 'none',
                      background: '#ffffff',
                    }}
                  >
                    <span className="pl-5 pr-0.5 py-3.5 text-sm font-semibold select-none pointer-events-none text-slate-500 bg-slate-50/50">
                      {import.meta.env.VITE_BASE_URL || 'short.link'}/
                    </span>
                    <input
                      className="w-full bg-transparent pl-0.5 pr-4 py-3.5 text-sm font-semibold outline-none border-none text-indigo-600 placeholder:text-slate-400 placeholder:font-normal"
                      placeholder="my-awesome-link"
                      value={form.customAlias}
                      onChange={(e) => setForm((p) => ({ ...p, customAlias: e.target.value }))}
                      onFocus={() => setFocused('alias')}
                      onBlur={() => setFocused(null)}
                      maxLength="30"
                    />
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#64748b' }}>
                    3–30 characters: letters, numbers, and hyphens only
                  </p>
                </div>

                {/* Expiry Date */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold tracking-wide" style={{ color: '#475569' }}>
                    Expiry Date (Optional)
                  </label>
                  <div className="relative">
                    <svg className="absolute inset-y-0 left-5 w-5 h-5 flex items-center pointer-events-none" style={{ color: focused === 'expiry' ? 'rgb(var(--rgb-primary))' : '#64748b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="date"
                      className="input-dark w-full pl-14 pr-4 py-3.5 text-sm"
                      value={form.expiryDate}
                      onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
                      onFocus={() => setFocused('expiry')}
                      onBlur={() => setFocused(null)}
                      min={new Date().toISOString().split('T')[0]}
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#64748b' }}>
                    Links will stop working after this date
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={mutation.isPending || !form.originalUrl.trim()}
          whileHover={{ y: mutation.isPending || !form.originalUrl.trim() ? 0 : -2 }}
          whileTap={{ scale: mutation.isPending || !form.originalUrl.trim() ? 1 : 0.96 }}
          className="w-full py-4 rounded-xl font-bold text-base text-white flex items-center justify-center gap-3 transition-all duration-300 relative mt-8"
          style={{
            background: mutation.isPending || !form.originalUrl.trim()
              ? 'linear-gradient(135deg, rgba(var(--rgb-primary),0.3) 0%, rgba(var(--rgb-secondary),0.2) 100%)'
              : 'linear-gradient(135deg, rgb(var(--rgb-primary)) 0%, rgb(var(--rgb-secondary)) 50%, rgb(var(--rgb-secondary)) 100%)',
            boxShadow: mutation.isPending || !form.originalUrl.trim() ? 'none' : '0 4px 15px rgba(var(--rgb-primary),0.3)',
            cursor: mutation.isPending || !form.originalUrl.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {mutation.isPending ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>Creating your short link...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Create Short URL</span>
            </>
          )}
        </motion.button>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs mt-6"
          style={{ color: '#64748b' }}
        >
          ⚡ Instant generation • 📊 Real-time analytics • 🔗 Custom domains
        </motion.p>
      </form>
    </motion.div>
  );
};

export default CreateUrlForm;
