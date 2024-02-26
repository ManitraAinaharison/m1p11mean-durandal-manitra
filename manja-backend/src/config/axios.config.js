const axios = require('axios')

require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
});

const axiosInstance = axios.create({
  baseURL: process.env.AXIOS_BASE_URL, // Replace with your actual base URL
  timeout: 5000, // Set a timeout for requests (optional)
  headers: {
    "Content-Type": "application/json", // Set content type (optional)
  },
});

module.exports.axiosInstance = axiosInstance;