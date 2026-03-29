const express = require('express');
const { createJob, getJobStatus } = require('../controllers/jobController');
const { validateJobCreation } = require('../middlewares/validation');

const router = express.Router();

router.post('/jobs', validateJobCreation, createJob);
router.get('/jobs/:id', getJobStatus);

module.exports = router;