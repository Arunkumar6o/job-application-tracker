const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');

const router = express.Router();

// All application routes require valid Supabase user authentication
router.use(requireAuth);

router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
