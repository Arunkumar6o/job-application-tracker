const { supabase } = require('../services/supabaseClient');

// Allowed status values per schema
const ALLOWED_STATUSES = ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];

// Allowed job types per schema
const ALLOWED_JOB_TYPES = ['Full-time', 'Internship', 'Part-time'];

/**
 * Validate application input data
 */
const validateApplicationInput = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.company_name !== undefined) {
    if (!data.company_name || typeof data.company_name !== 'string' || !data.company_name.trim()) {
      errors.push('Company Name is required.');
    }
  }

  if (!isUpdate || data.job_title !== undefined) {
    if (!data.job_title || typeof data.job_title !== 'string' || !data.job_title.trim()) {
      errors.push('Job Title is required.');
    }
  }

  if (data.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(data.status)) {
      errors.push(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
    }
  } else if (!isUpdate) {
    errors.push('Status is required.');
  }

  if (data.job_type && !ALLOWED_JOB_TYPES.includes(data.job_type)) {
    errors.push(`Job Type must be one of: ${ALLOWED_JOB_TYPES.join(', ')}.`);
  }

  if (!isUpdate || data.application_date !== undefined) {
    if (!data.application_date) {
      errors.push('Application Date is required.');
    } else {
      const parsedDate = new Date(data.application_date);
      if (isNaN(parsedDate.getTime())) {
        errors.push('Application Date must be a valid date.');
      }
    }
  }

  return errors;
};

/**
 * GET /api/applications
 * Retrieve all applications for the authenticated user
 */
const getAllApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('application_date', { ascending: false });

    if (error) {
      console.error('[DB ERROR] Fetch applications:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve applications from database.',
      });
    }

    return res.status(200).json({
      success: true,
      count: data ? data.length : 0,
      data: data || [],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/:id
 * Retrieve a single application by ID for the authenticated user
 */
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required.',
      });
    }

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/applications
 * Create a new application for the authenticated user
 */
const createApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      company_name,
      job_title,
      job_type,
      job_url,
      application_date,
      status,
      notes,
    } = req.body;

    // Validate inputs
    const errors = validateApplicationInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(' '),
        errors,
      });
    }

    const newRecord = {
      user_id: userId, // Server-enforced ownership
      company_name: company_name.trim(),
      job_title: job_title.trim(),
      job_type: job_type || null,
      job_url: job_url ? job_url.trim() : null,
      application_date: application_date || new Date().toISOString().split('T')[0],
      status: status || 'Applied',
      notes: notes ? notes.trim() : null,
    };

    const { data, error } = await supabase
      .from('applications')
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      console.error('[DB ERROR] Insert application:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create job application.',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Job application created successfully.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/applications/:id
 * Update an existing application belonging to the authenticated user
 */
const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      company_name,
      job_title,
      job_type,
      job_url,
      application_date,
      status,
      notes,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required.',
      });
    }

    // Validate inputs for update
    const errors = validateApplicationInput(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(' '),
        errors,
      });
    }

    const updates = {};
    if (company_name !== undefined) updates.company_name = company_name.trim();
    if (job_title !== undefined) updates.job_title = job_title.trim();
    if (job_type !== undefined) updates.job_type = job_type || null;
    if (job_url !== undefined) updates.job_url = job_url ? job_url.trim() : null;
    if (application_date !== undefined) updates.application_date = application_date;
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes ? notes.trim() : null;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or unauthorized to edit.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job application updated successfully.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/applications/:id
 * Delete an application belonging to the authenticated user
 */
const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required.',
      });
    }

    const { data, error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('[DB ERROR] Delete application:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete application.',
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or unauthorized to delete.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job application deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
