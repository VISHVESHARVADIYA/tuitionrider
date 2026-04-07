const express = require("express");
const {
  getStudents,
  getTutors,
  getMatchSuggestions,
  createMatch,
  markContacted,
  deleteRequest,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);
router.get("/students", getStudents);
router.get("/tutors", getTutors);
router.get("/matches", getMatchSuggestions);
router.post("/match", createMatch);
router.patch("/student/:id/contacted", (req, res, next) => {
  req.params.type = "student";
  return markContacted(req, res, next);
});
router.patch("/tutor/:id/contacted", (req, res, next) => {
  req.params.type = "tutor";
  return markContacted(req, res, next);
});
router.delete("/student/:id", (req, res, next) => {
  req.params.type = "student";
  return deleteRequest(req, res, next);
});
router.delete("/tutor/:id", (req, res, next) => {
  req.params.type = "tutor";
  return deleteRequest(req, res, next);
});

module.exports = router;
