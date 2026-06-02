// src/components/shared/ProfileSettingsModal.jsx
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const ProfileSettingsModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!form.email.trim()) {
      toast.error('Email cannot be empty');
      return;
    }
    
    setLoading(true);
    const res = await updateProfile(
      form.name.trim(),
      form.email.trim(),
      form.password || undefined
    );
    setLoading(false);
    
    if (res.success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile Settings" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="John Doe"
          required
        />
        <Input
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="john@example.com"
          required
        />
        <Input
          label="New Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          placeholder="••••••"
          helpText="Leave blank to keep your current password (min 6 characters, at least 1 number)"
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" className="flex-1" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileSettingsModal;
