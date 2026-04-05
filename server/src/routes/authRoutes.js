const express = require("express");
const { body } = require("express-validator");
const { passport } = require("../config/passport");
const handleValidation = require("../middleware/validationMiddleware");
const { login, signup, googleCallback } = require("../controllers/authController");

const router = express.Router();
const googleAuthConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET) &&
  Boolean(process.env.GOOGLE_CALLBACK_URL);

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],
  handleValidation,
  signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  handleValidation,
  login
);

router.get("/google", (req, res, next) => {
  if (!googleAuthConfigured) {
    return res.status(503).json({
      message: "Google OAuth is not configured yet. Please add Google env values.",
    });
  }

  return passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/failure", session: false }),
  googleCallback
);

router.get("/failure", (_req, res) => {
  res.status(401).json({ message: "Google authentication failed." });
});

module.exports = router;
