import React from 'react';

/**
 * StatCard Component
 * Displays a dynamic metric with label and count.
 */
const StatCard = ({ title, value, icon, description }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {description && <div className="stat-card-footer">{description}</div>}
    </div>
  );
};

export default StatCard;
