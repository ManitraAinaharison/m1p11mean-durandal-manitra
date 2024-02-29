const express = require("express");
const router = express.Router();

// Import route files
const statsRoutes = require("./controllers/stats.controller");
const ebitRoutes = require("./controllers/ebit.controller");

router.use('/v1', [statsRoutes, ebitRoutes]);

module.exports = router