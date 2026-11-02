import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to get the current Supabase access token for API requests
 */
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? session.access_token : null;
};

/**
 * Base fetch wrapper that attaches Authorization header and parses JSON
 */
const request = async (endpoint, options = {}) => {
  const token = await getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (data && (data.message || data.error)) ||
        `Request failed with status code ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to the backend server. Please verify the backend is running on port 5000.'
      );
    }
    throw err;
  }
};

/**
 * Applications API Client
 */
export const api = {
  // GET /api/applications
  async getApplications() {
    const res = await request('/applications', { method: 'GET' });
    return res.data || [];
  },

  // GET /api/applications/:id
  async getApplicationById(id) {
    const res = await request(`/applications/${id}`, { method: 'GET' });
    return res.data;
  },

  // POST /api/applications
  async createApplication(applicationData) {
    const res = await request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
    return res.data;
  },

  // PUT /api/applications/:id
  async updateApplication(id, applicationData) {
    const res = await request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    });
    return res.data;
  },

  // DELETE /api/applications/:id
  async deleteApplication(id) {
    const res = await request(`/applications/${id}`, {
      method: 'DELETE',
    });
    return res;
  },
};
