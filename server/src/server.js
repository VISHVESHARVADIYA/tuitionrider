require("dotenv").config();
const app = require("./app");
const connectDatabase = require("./config/db");
const { configurePassport } = require("./config/passport");

let initialized = false;

const initApp = async () => {
  if (initialized) return;
  await connectDatabase();
  configurePassport();
  initialized = true;
};

const handler = async (req, res) => {
  await initApp();
  app(req, res);
};

if (require.main === module) {
  const port = process.env.PORT || 5000;
  initApp()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  module.exports = handler;
}
