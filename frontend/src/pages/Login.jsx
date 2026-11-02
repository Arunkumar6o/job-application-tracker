import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Login Page
 * Supabase authentication login with clean error handling and validation.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, isConfigured } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to sign in. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">J</div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your Job Application Tracker</p>
        </div>

        {!isConfigured && (
          <div className="alert alert-info">
            <span>ℹ️</span>
            <div>
              <strong>Setup Notice:</strong> Supabase environment variables are not yet configured. Please create your <code>frontend/.env</code> and <code>backend/.env</code> with credentials from your Supabase dashboard.
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="login-email"
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
            <label className="form-label" htmlFor="login-password">
              Password <span className="required">*</span>
            </label>
            <input
              id="login-password"
              type="password"
              className={`form-input ${errors.password ? 'has-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner spinner-white" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
