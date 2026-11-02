import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Register Page
 * Supabase registration with full name, password confirmation, and input validation.
 */
const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, isConfigured } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const data = await register(email, password, fullName.trim());
      // Supabase may require email confirmation or log user in immediately
      if (data?.session) {
        navigate('/');
      } else {
        setSuccessMessage(
          'Account created successfully! If email confirmation is enabled on your Supabase project, check your inbox.'
        );
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">J</div>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Start tracking your job search today</p>
        </div>

        {!isConfigured && (
          <div className="alert alert-info">
            <span>ℹ️</span>
            <div>
              <strong>Setup Notice:</strong> Supabase environment variables are not yet configured. Please create your <code>frontend/.env</code> with credentials from your Supabase dashboard.
            </div>
          </div>
        )}

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
            <label className="form-label" htmlFor="register-name">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="register-name"
              type="text"
              className={`form-input ${errors.fullName ? 'has-error' : ''}`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Johnson"
              autoComplete="name"
            />
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="register-email"
              type="email"
              className={`form-input ${errors.email ? 'has-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password <span className="required">*</span>
            </label>
            <input
              id="register-password"
              type="password"
              className={`form-input ${errors.password ? 'has-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
            <div className="form-hint">At least 6 characters</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              id="register-confirm"
              type="password"
              className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div className="form-error">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner spinner-white" />
                <span>Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
