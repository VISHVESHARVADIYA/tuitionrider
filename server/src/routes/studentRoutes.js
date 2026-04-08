const express = require("express");
const { body, param } = require("express-validator");
const { registerStudent, getAllStudents, updateStudent } = require("../controllers/studentController");
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
    body("timeSlot").notEmpty().withMessage("Time slot is required."),
    body("subjects").isArray({ min: 1 }).withMessage("At least one subject is required."),
  ],
  handleValidation,
  registerStudent
);

router.get("/all", getAllStudents);

router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid student ID."),
    body("name").optional().notEmpty().withMessage("Name cannot be empty."),
    body("class").optional().notEmpty().withMessage("Class cannot be empty."),
    body("parentContact").optional().notEmpty().withMessage("Parent contact cannot be empty."),
    body("email").optional().isEmail().withMessage("Valid email is required."),
    body("budget").optional().isNumeric().withMessage("Budget must be numeric."),
    body("timeSlot").optional().notEmpty().withMessage("Time slot cannot be empty."),
    body("subjects").optional().isArray({ min: 1 }).withMessage("At least one subject is required."),
  ],
  handleValidation,
  updateStudent
);

module.exports = router;
