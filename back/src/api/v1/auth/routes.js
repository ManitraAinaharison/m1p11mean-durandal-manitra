const express = require("express");
const router = express.Router();

// Import route files
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");

router.use('/v1', [userRoutes, authRoutes])

module.exports = router