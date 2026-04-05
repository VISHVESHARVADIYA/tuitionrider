const express = require("express");
const { body } = require("express-validator");
const { registerStudent, getAllStudents } = require("../controllers/studentController");
const handleValidation = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required."),
    body("class").notEmpty().withMessage("Class is required."),
    body("parentContact").notEmpty().withMessage("Parent contact is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("budget").isNumeric().withMessage("Budget must be numeric."),
  ],
  handleValidation,
  registerStudent
);

router.get("/all", getAllStudents);

module.exports = router;
