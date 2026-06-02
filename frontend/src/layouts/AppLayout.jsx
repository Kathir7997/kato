// src/layouts/AppLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden mesh-grid app-light-theme" style={{ background: 'var(--color-bg)' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarCollapsed((p) => !p)} />
        <motion.main
          key="main"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="flex-1 overflow-y-auto p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AppLayout;
