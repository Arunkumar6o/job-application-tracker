import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const JOB_TYPES = ['Full-time', 'Internship', 'Part-time'];
const STATUS_OPTIONS = ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];

/**
 * AddApplication Page
 * Clean form to record a new job application with input validation and backend persistence.
 */
const AddApplication = () => {
  const navigate = useNavigate();

  // Get current date in YYYY-MM-DD format as default
  const todayDate = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    job_type: 'Full-time',
    job_url: '',
    application_date: todayDate,
    status: 'Applied',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.createApplication(formData);
      setSuccessMessage('Job application saved successfully!');
      setTimeout(() => {
        navigate('/applications');
      }, 1200);
    } catch (err) {
      console.error('Create error:', err);
      setErrorMessage(
        err.message || 'Failed to save application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Add Job Application</h2>
          <p className="form-subtitle">
            Enter the details of your job or internship application.
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <div>{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <span>✓</span>
            <div>{successMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="company_name">
              Company Name <span className="required">*</span>
            </label>
            <input
              id="company_name"
              type="text"
              name="company_name"
              className={`form-input ${errors.company_name ? 'has-error' : ''}`}
              placeholder="e.g. Acme Corp, Stripe, Microsoft"
              value={formData.company_name}
              onChange={handleChange}
            />
            {errors.company_name && (
              <div className="form-error">{errors.company_name}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="job_title">
              Job Title / Role <span className="required">*</span>
            </label>
            <input
              id="job_title"
              type="text"
              name="job_title"
              className={`form-input ${errors.job_title ? 'has-error' : ''}`}
              placeholder="e.g. Software Engineer, Frontend Intern"
              value={formData.job_title}
              onChange={handleChange}
            />
            {errors.job_title && (
              <div className="form-error">{errors.job_title}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="job_type">
                Job Type
              </label>
              <select
                id="job_type"
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
              <label className="form-label" htmlFor="status">
                Application Status
              </label>
              <select
                id="status"
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
              <label className="form-label" htmlFor="application_date">
                Application Date <span className="required">*</span>
              </label>
              <input
                id="application_date"
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
              <label className="form-label" htmlFor="job_url">
                Job URL or Posting Link (optional)
              </label>
              <input
                id="job_url"
                type="url"
                name="job_url"
                className="form-input"
                placeholder="https://company.com/careers/job-123"
                value={formData.job_url}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">
              Job Description or Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              rows="3"
              placeholder="Notes on the hiring manager, salary range, tech stack, referral, etc."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner spinner-white" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplication;
