const express = require('express');
const router = express.Router();

const authRoutes = require('../../controllers/auth/auth.js');
router.get('/login', authRoutes.getLogin);

module.exports = router;