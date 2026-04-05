const Student = require("../models/Student");
const Tutor = require("../models/Tutor");

const getStudents = async (_req, res) => {
  const requests = await Student.find().sort({ createdAt: -1 });
  return res.json({ requests });
};

const getTutors = async (_req, res) => {
  const requests = await Tutor.find().sort({ createdAt: -1 });
  return res.json({ requests });
};

const markContacted = async (req, res) => {
  const Model = req.params.type === "student" ? Student : Tutor;
  const request = await Model.findByIdAndUpdate(
    req.params.id,
    { contacted: true },
    { new: true }
  );

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }

  return res.json({ message: "Request marked as contacted.", request });
};

const deleteRequest = async (req, res) => {
  const Model = req.params.type === "student" ? Student : Tutor;
  const request = await Model.findByIdAndDelete(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }

  return res.json({ message: "Request deleted successfully." });
};

module.exports = { getStudents, getTutors, markContacted, deleteRequest };
