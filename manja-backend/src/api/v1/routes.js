const express = require("express");
const router = express.Router();

// Import route files
const authRoutes = require("./auth/routes");
const serviceRoutes = require("./service/routes");
const statsRoutes = require("./stats/routes");

router.use([
    authRoutes,
    serviceRoutes,
    statsRoutes
]);

module.exports = router;