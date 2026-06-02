// src/components/shared/QRModal.jsx
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { downloadDataURI } from '../../utils/helpers';

const QRModal = ({ isOpen, onClose, url }) => {
  if (!url) return null;

  const shortUrl = url.shortUrl || `${import.meta.env.VITE_BASE_URL}/${url.shortCode}`;

  const handleDownload = () => {
    if (url.qrCode) {
      downloadDataURI(url.qrCode, `qr-${url.shortCode}.png`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code" size="sm">
      <div className="flex flex-col items-center gap-5">
        {url.qrCode ? (
          <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <img
              src={url.qrCode}
              alt={`QR code for ${url.shortCode}`}
              className="w-56 h-56 rounded-xl"
            />
          </div>
        ) : (
          <div className="w-56 h-56 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
            QR not available
          </div>
        )}
        <div className="w-full text-center">
          <p className="text-xs text-gray-400 mb-1">Short URL</p>
          <p className="text-sm font-medium text-indigo-600 break-all">{shortUrl}</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button variant="gradient" className="flex-1" onClick={handleDownload} disabled={!url.qrCode}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QRModal;
