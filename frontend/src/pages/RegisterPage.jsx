// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [focused, setFocused] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    else if (!/\d/.test(form.password)) errs.password = 'Must include at least one number';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/dashboard');
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/\d/.test(p)) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColors = ['', '#f87171', '#fb923c', '#facc15', '#34d399', '#10b981'];

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      
      {/* Full-screen background image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/auth-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: 'rgba(8, 4, 20, 0.55)' }}
      />
      {/* Animated colour orbs */}
      <div className="orb absolute z-0" style={{ width: 520, height: 520, top: '-10%', left: '-8%', background: 'rgba(var(--rgb-primary),0.25)' }} />
      <div className="orb absolute z-0" style={{ width: 400, height: 400, bottom: '-10%', right: '-6%', background: 'rgba(var(--rgb-secondary),0.2)', animationDelay: '4s' }} />
      <div className="orb absolute z-0" style={{ width: 300, height: 300, top: '40%', right: '20%', background: 'rgba(236,72,153,0.12)', animationDelay: '8s' }} />

      <motion.div
        className="w-full max-w-5xl md:min-h-[600px] relative z-10 flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] m-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'transparent',
          boxShadow: '0 32px 80px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.08)',
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Left Side: Branding & Graphics — Glassmorphism panel */}
        <div
          className="hidden md:flex md:w-1/2 relative p-10 flex-col items-center justify-center overflow-hidden"
          style={{
            background: 'rgba(80, 40, 140, 0.25)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderRight: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(var(--rgb-primary),0.18) 0%, rgba(var(--rgb-secondary),0.1) 60%, rgba(236,72,153,0.08) 100%)', zIndex: 0 }} />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <motion.div 
               className="w-28 h-28 flex items-center justify-center relative"
               animate={{ y: [0, -10, 0], rotate: [0, 3, 0, -3, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div style={{
                width: 112, height: 112, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(var(--rgb-primary),0.5) 0%, rgba(var(--rgb-secondary),0.5) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(var(--rgb-secondary),0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
                  <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>

            <div className="text-center">
              <h2 className="text-4xl font-black text-white tracking-wider mb-2" style={{ fontFamily: 'Outfit, sans-serif', textShadow: '0 2px 20px rgba(var(--rgb-secondary),0.5)' }}>
                KatoShort
              </h2>
              <p className="text-purple-200 text-sm font-medium opacity-80 tracking-widest uppercase">Smart URL Shortener</p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-col gap-3 mt-4 w-full max-w-[220px]">
              {[['🔗', 'Shorten any link instantly'], ['📊', 'Track clicks & analytics'], ['🔒', 'Secure & reliable']].map(([icon, text]) => (
                <div key={text} style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <motion.div
          className="w-full md:w-1/2 p-10 md:p-14 flex flex-col items-center justify-center"
          style={{
            background: 'rgba(12, 6, 30, 0.6)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Centered content wrapper */}
          <div className="w-full max-w-sm">

          <h1 className="text-4xl font-bold text-white tracking-wide text-center" style={{ marginBottom: '32px' }}>SIGN UP</h1>

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="relative" style={{ marginBottom: '20px' }}>
              <input
                type="text"
                className="w-full px-5 py-5 rounded-xl text-base outline-none transition-all font-medium text-center placeholder:text-gray-400"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: focused === 'username' ? '1.5px solid rgba(199, 150, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  boxShadow: focused === 'username' ? '0 0 0 3px rgba(var(--rgb-secondary), 0.25)' : 'none',
                }}
                placeholder="Username"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                onFocus={() => setFocused('username')}
                onBlur={() => setFocused(null)}
                autoComplete="name"
              />
              {errors.name && <p className="text-xs font-medium mt-1 text-center" style={{ color: '#ff6b6b' }}>{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="relative" style={{ marginBottom: '20px' }}>
              <input
                type="email"
                className="w-full px-5 py-5 rounded-xl text-base outline-none transition-all font-medium text-center placeholder:text-gray-400"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: focused === 'email' ? '1.5px solid rgba(199, 150, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  boxShadow: focused === 'email' ? '0 0 0 3px rgba(var(--rgb-secondary), 0.25)' : 'none',
                }}
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs font-medium mt-1 text-center" style={{ color: '#ff6b6b' }}>{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="relative" style={{ marginBottom: '20px' }}>
              <input
                type={showPass ? 'text' : 'password'}
                className="w-full px-5 pr-12 py-5 rounded-xl text-base outline-none transition-all font-medium text-center placeholder:text-gray-400"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: focused === 'password' ? '1.5px solid rgba(199, 150, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  boxShadow: focused === 'password' ? '0 0 0 3px rgba(var(--rgb-secondary), 0.25)' : 'none',
                }}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-4 inset-y-0 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPass ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.password && <p className="text-xs font-medium mt-1 text-center" style={{ color: '#ff6b6b' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password Input */}
            <div className="relative" style={{ marginBottom: '20px' }}>
              <input
                type={showConfirmPass ? 'text' : 'password'}
                className="w-full px-5 pr-12 py-5 rounded-xl text-base outline-none transition-all font-medium text-center placeholder:text-gray-400"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: focused === 'confirm' ? '1.5px solid rgba(199, 150, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  boxShadow: focused === 'confirm' ? '0 0 0 3px rgba(var(--rgb-secondary), 0.25)' : 'none',
                }}
                placeholder="Confirm password"
                value={form.confirm}
                onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                onFocus={() => setFocused('confirm')}
                onBlur={() => setFocused(null)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(p => !p)}
                className="absolute right-4 inset-y-0 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showConfirmPass ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.confirm && <p className="text-xs font-medium mt-1 text-center" style={{ color: '#ff6b6b' }}>{errors.confirm}</p>}
            </div>

            {/* Policy text */}
            <div className="text-center text-xs text-gray-400" style={{ marginBottom: '24px' }}>
              You are agreeing to The <a href="#" className="font-bold text-white hover:text-purple-300">Terms of Services</a> and <a href="#" className="font-bold text-white hover:text-purple-300">Privacy Policy</a>
            </div>

            {/* Sign Up Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              style={{
                background: loading ? 'rgba(var(--rgb-primary),0.4)' : 'linear-gradient(90deg, rgb(var(--rgb-primary)) 0%, rgb(var(--rgb-accent-1)) 100%)',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '24px',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                'Register'
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm" style={{ marginTop: '0px' }}>
            <span style={{ color: '#9ca3af' }}>Already a member? </span>
            <Link to="/login" className="font-bold text-white hover:text-purple-300 transition-colors">
              Log In
            </Link>
          </div>

          </div>{/* end centered wrapper */}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
