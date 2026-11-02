import React from 'react';

/**
 * StatusBadge Component
 * Renders a clean, muted, accessible badge for application status.
 */
const StatusBadge = ({ status }) => {
  const getBadgeClass = (statusValue) => {
    switch (statusValue) {
      case 'Applied':
        return 'status-badge-applied';
      case 'Assessment':
        return 'status-badge-assessment';
      case 'Interview':
        return 'status-badge-interview';
      case 'Offer':
        return 'status-badge-offer';
      case 'Rejected':
        return 'status-badge-rejected';
      default:
        return 'status-badge-applied';
    }
  };

  return (
    <span className={`status-badge ${getBadgeClass(status)}`}>
      {status || 'Applied'}
    </span>
  );
};

export default StatusBadge;
