import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationCard from '../components/ApplicationCard';
import EditModal from '../components/EditModal';
import ConfirmModal from '../components/ConfirmModal';

const STATUS_FILTER_OPTIONS = [
  'All Statuses',
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected',
];

/**
 * Applications Page (My Applications)
 * Search, filter, view, edit, and delete all applications with responsive table and card presentation.
 */
const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Modals state
  const [editingApp, setEditingApp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingApp, setDeletingApp] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter & Search & Sort logic
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Search term matches company or job title
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          app.company_name?.toLowerCase().includes(query) ||
          app.job_title?.toLowerCase().includes(query);

        // Status filter
        const matchesStatus =
          statusFilter === 'All Statuses' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Sort newest first by application_date
        const dateA = new Date(a.application_date || 0);
        const dateB = new Date(b.application_date || 0);
        return dateB - dateA;
      });
  }, [applications, searchTerm, statusFilter]);

  // Handle Edit
  const handleSaveEdit = async (id, updatedData) => {
    setIsSaving(true);
    try {
      const updated = await api.updateApplication(id, updatedData);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );
      setEditingApp(null);
      setSuccessMessage('Application updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingApp) return;
    setIsDeleting(true);
    try {
      await api.deleteApplication(deletingApp.id);
      setApplications((prev) => prev.filter((app) => app.id !== deletingApp.id));
      setDeletingApp(null);
      setSuccessMessage('Application deleted successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header-bar">
        <div>
          <h2 className="dashboard-heading">My Applications</h2>
          <p className="dashboard-subheading">
            Review and organize all of your job applications in one unified place.
          </p>
        </div>
        <Link to="/add-application" className="btn btn-primary">
          <span>➕</span>
          <span>Add Application</span>
        </Link>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          <span>✓</span>
          <div>{successMessage}</div>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <div>
            <strong>Error:</strong> {error}
            <button
              onClick={fetchApplications}
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: '1rem' }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filters-bar">
        <div className="filters-left">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by company or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_FILTER_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || statusFilter !== 'All Statuses') && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All Statuses');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Content Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3 className="section-title">
            All Applications ({filteredApplications.length}
            {filteredApplications.length !== applications.length &&
              ` of ${applications.length}`}
            )
          </h3>
        </div>

        {loading ? (
          <div
            style={{
              padding: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div className="spinner" />
            <span>Loading applications...</span>
          </div>
        ) : (
          <>
            <ApplicationTable
              applications={filteredApplications}
              onEdit={(app) => setEditingApp(app)}
              onDelete={(app) => setDeletingApp(app)}
              emptyMessage={
                searchTerm || statusFilter !== 'All Statuses'
                  ? 'No applications match your current search or filter criteria.'
                  : 'You have not added any job applications yet.'
              }
            />

            {/* Mobile Cards Grid */}
            <div className="cards-grid" style={{ padding: '1rem' }}>
              {filteredApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onEdit={(item) => setEditingApp(item)}
                  onDelete={(item) => setDeletingApp(item)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <EditModal
        isOpen={Boolean(editingApp)}
        application={editingApp}
        isSaving={isSaving}
        onSave={handleSaveEdit}
        onClose={() => setEditingApp(null)}
      />

      <ConfirmModal
        isOpen={Boolean(deletingApp)}
        title="Delete Application"
        message={`Are you sure you want to delete your application for "${deletingApp?.job_title}" at "${deletingApp?.company_name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingApp(null)}
      />
    </div>
  );
};

export default Applications;
