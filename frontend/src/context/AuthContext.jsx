// src/context/AuthContext.jsx
// Global authentication state management

import { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('kato_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      const userData = data.data;
      localStorage.setItem('kato_token', userData.token);
      localStorage.setItem('kato_user', JSON.stringify(userData));
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}! 👋`);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password });
      const userData = data.data;
      localStorage.setItem('kato_token', userData.token);
      localStorage.setItem('kato_user', JSON.stringify(userData));
      setUser(userData);
      toast.success(`Account created! Welcome, ${userData.name}! 🎉`);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile({ name, email, password });
      const userData = data.data;
      localStorage.setItem('kato_token', userData.token);
      localStorage.setItem('kato_user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Profile updated successfully! ✨');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('kato_token');
    localStorage.removeItem('kato_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
