const express = require('express');
const router = express.Router();

const movieRoutes = require('../../controllers/movies/movies.js');
router.get('/details/:id', movieRoutes.getDetails);
router.get('/review/:name/:date/:poster/:id', movieRoutes.getReview);

module.exports = router;