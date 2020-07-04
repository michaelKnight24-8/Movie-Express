const express = require('express');
const router = express.Router();
const isUser = require('../../middleware/isUser');

const movieRoutes = require('../../controllers/movies/movies.js');
router.get('/details/:id/:showURL', movieRoutes.getDetails);
router.get('/review/:name/:date/:poster/:id', isUser, movieRoutes.getReview);

module.exports = router;