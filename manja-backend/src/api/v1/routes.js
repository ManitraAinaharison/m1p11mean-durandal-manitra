const express = require("express");
const router = express.Router();

// Import route files
const authRoutes = require("./auth/routes");
const serviceRoutes = require("./service/routes");

router.use([
    authRoutes,
    serviceRoutes
]);

module.exports = router;