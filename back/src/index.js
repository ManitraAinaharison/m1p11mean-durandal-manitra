const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
});

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose.connect(process.env.MONGO_STRING_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Enables the new unified topology engine (recommended for future compatibility).
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB!");

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
