require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
});

let mockDataFunctions = null;

if (process.env.API_VERSION === "v1") {
  mockDataFunctions = require("../api/v1/test/mock-requests");
}

module.exports.mockDataFunctions = mockDataFunctions;
