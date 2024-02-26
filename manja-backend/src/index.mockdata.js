const axiosInstance = require('./config/axios.config')
const mongoose = require("mongoose");
const { mockDataFunctions } = require('./config/mock-data.config');

require("dotenv").config({
    path: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
});

mongoose.connect(process.env.MONGO_STRING_URL, {
  serverApi: { version: "1", strict: true },
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", async () => {
    console.log('connected to mongo database')

    await mockDataFunctions.authMockRequests.cleanDb();
    await mockDataFunctions.authMockRequests.createAdmin();
    await mockDataFunctions.authMockRequests.createEmployees();
    await mockDataFunctions.authMockRequests.createUsers();
    await mockDataFunctions.subServiceMockRequests.createSubServices();
    await mockDataFunctions.serviceMockRequests.createServices();
    await mockDataFunctions.subServiceMockRequests.assignSubServicesToEmployees();
});