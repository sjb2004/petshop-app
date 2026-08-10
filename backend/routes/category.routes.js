const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/category.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', getCategories);
router.post('/', verifyToken, requireAdmin, createCategory);
router.delete('/:id', verifyToken, requireAdmin, deleteCategory);

module.exports = router;