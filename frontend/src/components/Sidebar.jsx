import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Sidebar Component
 * Provides clean navigation across primary views with responsive drawer support.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'nav-item active' : 'nav-item';

  return (
    <>
      <div
        className={`mobile-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">J</div>
          <span className="brand-text">Job Tracker</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={navLinkClass} onClick={onClose} end>
            <span className="nav-item-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/applications" className={navLinkClass} onClick={onClose}>
            <span className="nav-item-icon">📁</span>
            <span>My Applications</span>
          </NavLink>

          <NavLink to="/add-application" className={navLinkClass} onClick={onClose}>
            <span className="nav-item-icon">➕</span>
            <span>Add Application</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
            title="Log out of your account"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
