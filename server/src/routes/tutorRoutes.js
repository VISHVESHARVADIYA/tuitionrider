const express = require("express");
const { body, param } = require("express-validator");
const { registerTutor, getAllTutors, updateTutor } = require("../controllers/tutorController");
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
    body("timeSlot").notEmpty().withMessage("Time slot is required."),
  ],
  handleValidation,
  registerTutor
);

router.get("/all", getAllTutors);

router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid tutor ID."),
    body("name").optional().notEmpty().withMessage("Name cannot be empty."),
    body("qualification").optional().notEmpty().withMessage("Qualification cannot be empty."),
    body("subjects").optional().isArray({ min: 1 }).withMessage("At least one subject is required."),
    body("email").optional().isEmail().withMessage("Valid email is required."),
    body("phone").optional().notEmpty().withMessage("Phone cannot be empty."),
    body("fees").optional().isNumeric().withMessage("Fees must be numeric."),
    body("timeSlot").optional().notEmpty().withMessage("Time slot cannot be empty."),
  ],
  handleValidation,
  updateTutor
);

module.exports = router;
