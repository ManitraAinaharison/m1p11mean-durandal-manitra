const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
});

mongoose.connect(process.env.MONGO_STRING_URL);

const db = mongoose.connection;

const app = express();
const port = process.env.PORT;

const routes = require('./config/routes.config') // routes changes based on API version

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  app.use('/', routes)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
