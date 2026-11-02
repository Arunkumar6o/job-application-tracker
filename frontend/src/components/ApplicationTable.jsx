import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

/**
 * Format date string (YYYY-MM-DD or ISO) into readable localized format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * ApplicationTable Component
 * Renders table on desktop with edit/delete actions and a helpful empty state.
 */
const ApplicationTable = ({
  applications = [],
  onEdit,
  onDelete,
  emptyMessage = 'No applications found.',
}) => {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-title">No job applications yet</h3>
        <p className="empty-state-text">{emptyMessage}</p>
        <Link to="/add-application" className="btn btn-primary">
          <span>➕</span>
          <span>Add Application</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="app-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Role</th>
            <th>Applied Date</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>
                <div className="table-cell-company">{app.company_name}</div>
                {app.job_url && (
                  <div className="table-cell-url">
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open job link"
                    >
                      View Posting ↗
                    </a>
                  </div>
                )}
              </td>
              <td>
                <div className="table-cell-role">{app.job_title}</div>
                {app.job_type && (
                  <span className="job-type-tag" style={{ marginTop: '0.25rem' }}>
                    {app.job_type}
                  </span>
                )}
              </td>
              <td className="table-cell-date">{formatDate(app.application_date)}</td>
              <td>
                <StatusBadge status={app.status} />
              </td>
              <td>
                <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit && onEdit(app)}
                    title="Edit application details"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete && onDelete(app)}
                    title="Delete application"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
