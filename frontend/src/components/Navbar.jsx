import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Navbar Component (Dashboard Header)
 * Displays page title, welcome greeting, authenticated user, and quick Add Application action.
 */
const Navbar = ({ onToggleSidebar }) => {
  const { user, displayName } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <div className="header-title-block">
          <h1>Job Application Tracker</h1>
          <p>Welcome back, {displayName}!</p>
        </div>
      </div>

      <div className="header-right">
        <Link to="/add-application" className="btn btn-primary btn-sm">
          <span>➕</span>
          <span>Add Application</span>
        </Link>

        <div className="user-profile" title={user?.email || 'Logged in user'}>
          <div className="user-avatar">{getInitials(displayName)}</div>
          <div className="user-details">
            <span className="user-name">{displayName}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
