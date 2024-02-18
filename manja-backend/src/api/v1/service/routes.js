const express = require("express");
const router = express.Router();

// Import route files
const appointmentRoutes = require("./controllers/appointment.controller");
const serviceRoutes = require("./controllers/service.controller");
const subServiceRoutes = require("./controllers/subservice.controller");

router.use('/v1', [
    appointmentRoutes, 
    serviceRoutes,
    subServiceRoutes
])

module.exports = router