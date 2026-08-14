const express = require('express');
const router = express.Router();
const { getDashboardStats, getWeeklySummary } = require('../controllers/analytics.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/dashboard', verifyToken, requireAdmin, getDashboardStats);
router.get('/weekly-summary', verifyToken, requireAdmin, getWeeklySummary);

module.exports = router;