require("dotenv").config();
const app = require("./app");
const connectDatabase = require("./config/db");
const { configurePassport } = require("./config/passport");

connectDatabase().then(() => {
  configurePassport();
});

module.exports = app;
