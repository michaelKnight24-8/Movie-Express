const express = require('express');
const router = express.Router();

const movieRoutes = require('../../controllers/movies/movies.js');
router.get('/details/:id', movieRoutes.getDetails);

module.exports = router;