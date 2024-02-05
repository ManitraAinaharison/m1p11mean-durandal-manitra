const express = require("express");
const router = express.Router();

// Import route files
const authRoutes = require("./auth/routes");

router.use([authRoutes]);

module.exports = router;