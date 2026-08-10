const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analytics.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/dashboard', verifyToken, requireAdmin, getDashboardStats);

module.exports = router;