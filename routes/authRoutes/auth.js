const express = require('express');
const router = express.Router();

const authRoutes = require('../../controllers/auth/auth.js');
router.get('/login', authRoutes.getLogin);
router.post("/signup", authRoutes.postSignUp);
router.post('/login', authRoutes.postLogin);
router.get('/theme/:color/:avatar', authRoutes.changeTheme);
router.get('/logout', authRoutes.logout);
module.exports = router;