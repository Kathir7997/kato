// src/components/shared/EditUrlModal.jsx
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { urlAPI } from '../../services/api';

const EditUrlModal = ({ isOpen, onClose, url }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ originalUrl: '', customAlias: '', expiryDate: '' });

  useEffect(() => {
    if (url) {
      setForm({
        originalUrl: url.originalUrl || '',
        customAlias: url.customAlias || '',
        expiryDate: url.expiryDate ? new Date(url.expiryDate).toISOString().split('T')[0] : '',
      });
    }
  }, [url]);

  const mutation = useMutation({
    mutationFn: (data) => urlAPI.update(url._id, data),
    onSuccess: () => {
      toast.success('URL updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update URL');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      originalUrl: form.originalUrl,
      customAlias: form.customAlias || undefined,
      expiryDate: form.expiryDate || null,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit URL" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Original URL"
          value={form.originalUrl}
          onChange={(e) => setForm((p) => ({ ...p, originalUrl: e.target.value }))}
          placeholder="https://example.com/your-long-url"
          required
        />
        <Input
          label="Custom Alias (optional)"
          value={form.customAlias}
          onChange={(e) => setForm((p) => ({ ...p, customAlias: e.target.value }))}
          placeholder="my-alias"
          helpText="Leave blank to keep existing short code"
          prefix={`${import.meta.env.VITE_BASE_URL}/`}
        />
        <Input
          label="Expiry Date (optional)"
          type="date"
          value={form.expiryDate}
          onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
          min={new Date().toISOString().split('T')[0]}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" className="flex-1" loading={mutation.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUrlModal;
