require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
});

let routes = null;

if(process.env.API_VERSION === "v1"){
    routes = require('../api/v1/routes')
}

module.exports = routes