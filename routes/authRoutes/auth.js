const express = require('express');
const router = express.Router();
const isUser = require('../../middleware/isUser');

const authRoutes = require('../../controllers/auth/auth.js');
router.get('/login', authRoutes.getLogin);
router.post("/signup", authRoutes.postSignUp);
router.post('/login', authRoutes.postLogin);
router.get('/theme/:color/:avatar', authRoutes.changeTheme);
router.get('/logout', authRoutes.logout);
router.post('/addReview/:spoiler', authRoutes.addReview);
router.get('/addFavorites/:img/:add', isUser, authRoutes.addFavorites);
router.get("/reset/:token", authRoutes.login);
router.post('/reset', authRoutes.reset);
router.post('/newPassword', authRoutes.newPassword);
module.exports = router;