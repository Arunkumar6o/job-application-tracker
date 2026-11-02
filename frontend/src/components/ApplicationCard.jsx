import React from 'react';
import StatusBadge from './StatusBadge';
import { formatDate } from './ApplicationTable';

/**
 * ApplicationCard Component
 * Mobile-friendly card rendering for job application records.
 */
const ApplicationCard = ({ application, onEdit, onDelete }) => {
  return (
    <div className="app-card">
      <div className="app-card-header">
        <div>
          <h4 className="app-card-title">{application.job_title}</h4>
          <span className="app-card-company">{application.company_name}</span>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="app-card-details">
        <div>
          <strong>Applied: </strong>
          <span>{formatDate(application.application_date)}</span>
        </div>
        {application.job_type && (
          <div>
            <span className="job-type-tag">{application.job_type}</span>
          </div>
        )}
        {application.job_url && (
          <div>
            <a
              href={application.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="table-cell-url"
            >
              Job Posting ↗
            </a>
          </div>
        )}
      </div>

      {application.notes && (
        <div className="app-card-notes">
          "{application.notes}"
        </div>
      )}

      <div className="app-card-footer">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit && onEdit(application)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete && onDelete(application)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
