// src/pages/NotFoundPage.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="auth-bg flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Button variant="gradient" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
