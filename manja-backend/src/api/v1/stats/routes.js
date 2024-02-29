const express = require("express");
const router = express.Router();

// Import route files
const statsRoutes = require("./controllers/stats.controller");

router.use('/v1', [statsRoutes]);

module.exports = router