const express = require("express");
const router = express.Router();

// Import route files
const userRoutes = require("./controllers/auth.controller");
const authRoutes = require("./controllers/user.controller");

router.use('/v1', [userRoutes, authRoutes])
// router.use('/v1', userRoutes)
// router.use('/v1', authRoutes)

module.exports = router