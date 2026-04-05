const express = require("express");
const { body } = require("express-validator");
const { registerTutor, getAllTutors } = require("../controllers/tutorController");
const handleValidation = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("qualification").notEmpty().withMessage("Qualification is required."),
    body("subjects").isArray({ min: 1 }).withMessage("At least one subject is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("phone").notEmpty().withMessage("Phone number is required."),
    body("fees").isNumeric().withMessage("Fees must be numeric."),
  ],
  handleValidation,
  registerTutor
);

router.get("/all", getAllTutors);

module.exports = router;
