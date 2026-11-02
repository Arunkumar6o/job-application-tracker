import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * ProtectedRoute Component
 * Guards private pages and renders the shared dashboard shell (Sidebar + Header).
 */
const ProtectedRoute = () => {
  const { user, loading, isConfigured } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: 'var(--bg-app)',
        }}
      >
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Loading your dashboard...
        </span>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {!isConfigured && (
          <div style={{ padding: '1rem 1.5rem 0' }}>
            <div className="alert alert-info">
              <span>ℹ️</span>
              <div>
                <strong>Supabase Setup Needed:</strong> Please configure your Supabase URL and Anon Key in <code>frontend/.env</code> to persist data and enable live authentication.
              </div>
            </div>
          </div>
        )}

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
