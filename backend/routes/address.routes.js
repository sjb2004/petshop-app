const express = require('express');
const router = express.Router();
const { createAddress, getMyAddresses } = require('../controllers/address.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, createAddress);
router.get('/', verifyToken, getMyAddresses);

module.exports = router;