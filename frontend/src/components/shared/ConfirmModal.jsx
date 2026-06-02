// src/components/shared/ConfirmModal.jsx
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-sm text-red-700 leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" className="flex-1" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
