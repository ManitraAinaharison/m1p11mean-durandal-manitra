const express = require("express");
const mongoose = require("mongoose");
const mongoDBAutoIP = require("mongodbautoip");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');

require("dotenv").config({
    path: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
});

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const routes = require("./config/routes.config"); // routes are based on API version
app.use("/", routes);

const mongoDBAutoIPConfig = {
    WHITELIST_RETENTION_PERIOD : 24 * 60 * 60 * 1000 //Currently 24hrs
}

const config = {
    projectId: process.env.ATLAS_PROJECT_ID,
    publicKey: process.env.ATLAS_API_PUBLIC,
    privateKey: process.env.ATLAS_API_PRIVATE,
    username: process.env.ATLAS_API_PUBLIC,
    password: process.env.ATLAS_API_PRIVATE,
};
// const { checkAndUpdateIP } = mongoDBAutoIP.setup(config);
// checkAndUpdateIP()
// .then(() => {
    mongoose.connect(process.env.MONGO_STRING_URL, {
        serverApi: { version: "1", strict: true, deprecationErrors: true },
    });

    const db = mongoose.connection;
    db.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });

    db.once("open", () => {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    });
// })
// .catch((error) => {
//   console.error("Failed to update IP whitelist on startup:", error);
// });
