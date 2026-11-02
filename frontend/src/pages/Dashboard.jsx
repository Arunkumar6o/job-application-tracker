import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationCard from '../components/ApplicationCard';
import EditModal from '../components/EditModal';
import ConfirmModal from '../components/ConfirmModal';

/**
 * Dashboard Page
 * Real-time dynamic overview of job applications, dynamic summary statistics,
 * and quick access to recent job applications.
 */
const Dashboard = () => {
  const { displayName } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Modals state
  const [editingApp, setEditingApp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingApp, setDeletingApp] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch applications
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

  // Compute dynamic stats from user records
  const totalApplications = applications.length;
  const appliedCount = applications.filter((app) => app.status === 'Applied').length;
  const interviewCount = applications.filter((app) => app.status === 'Interview').length;
  const offersCount = applications.filter((app) => app.status === 'Offer').length;

  // Recent applications (first 5 records, already sorted newest first from server)
  const recentApplications = applications.slice(0, 5);

  // Handle Edit submission
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

  // Handle Delete confirmation
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
          <h2 className="dashboard-heading">Dashboard Overview</h2>
          <p className="dashboard-subheading">
            Track and manage your recruitment pipeline in real time.
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

      {/* Dynamic Summary Cards */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Applications"
          value={loading ? '...' : totalApplications}
          icon="📊"
          description="Total active & past applications"
        />
        <StatCard
          title="Applied"
          value={loading ? '...' : appliedCount}
          icon="📨"
          description="Awaiting initial response"
        />
        <StatCard
          title="Interview"
          value={loading ? '...' : interviewCount}
          icon="💬"
          description="In conversation with team"
        />
        <StatCard
          title="Offers"
          value={loading ? '...' : offersCount}
          icon="🎉"
          description="Received employment offer"
        />
      </div>

      {/* Recent Applications Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h3 className="section-title">Recent Applications</h3>
          </div>
          {applications.length > 5 && (
            <Link to="/applications" className="btn btn-secondary btn-sm">
              View All ({applications.length}) →
            </Link>
          )}
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
            <span>Loading recent applications...</span>
          </div>
        ) : (
          <>
            <ApplicationTable
              applications={recentApplications}
              onEdit={(app) => setEditingApp(app)}
              onDelete={(app) => setDeletingApp(app)}
              emptyMessage="You haven't tracked any job applications yet. Click below to add your first one!"
            />

            {/* Mobile Card Layout */}
            <div className="cards-grid" style={{ padding: '1rem' }}>
              {recentApplications.map((app) => (
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

export default Dashboard;
