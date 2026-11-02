import React, { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];
const JOB_TYPES = ['Full-time', 'Internship', 'Part-time'];

/**
 * EditModal Component
 * Modal for editing existing application details.
 */
const EditModal = ({
  isOpen,
  application,
  onSave,
  onClose,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    job_type: 'Full-time',
    job_url: '',
    application_date: '',
    status: 'Applied',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (application) {
      setFormData({
        company_name: application.company_name || '',
        job_title: application.job_title || '',
        job_type: application.job_type || 'Full-time',
        job_url: application.job_url || '',
        application_date: application.application_date
          ? application.application_date.split('T')[0]
          : '',
        status: application.status || 'Applied',
        notes: application.notes || '',
      });
      setErrors({});
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company Name is required.';
    }
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job Title is required.';
    }
    if (!formData.application_date) {
      newErrors.application_date = 'Application Date is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(application.id, formData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Job Application</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Company Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                className={`form-input ${errors.company_name ? 'has-error' : ''}`}
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g. Google, Stripe"
              />
              {errors.company_name && (
                <div className="form-error">{errors.company_name}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Job Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="job_title"
                className={`form-input ${errors.job_title ? 'has-error' : ''}`}
                value={formData.job_title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer, Software Engineer"
              />
              {errors.job_title && (
                <div className="form-error">{errors.job_title}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select
                  name="job_type"
                  className="form-select"
                  value={formData.job_type}
                  onChange={handleChange}
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Application Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="application_date"
                  className={`form-input ${errors.application_date ? 'has-error' : ''}`}
                  value={formData.application_date}
                  onChange={handleChange}
                />
                {errors.application_date && (
                  <div className="form-error">{errors.application_date}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Job URL (optional)</label>
                <input
                  type="url"
                  name="job_url"
                  className="form-input"
                  value={formData.job_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes (optional)</label>
              <textarea
                name="notes"
                className="form-textarea"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Interview stages, referral contact, salary range, etc."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner spinner-white" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
