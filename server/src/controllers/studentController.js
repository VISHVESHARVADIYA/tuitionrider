const Student = require("../models/Student");

const registerStudent = async (req, res) => {
  const request = await Student.create(req.body);
  return res.status(201).json({ message: "Student request saved successfully.", request });
};

const getAllStudents = async (_req, res) => {
  const requests = await Student.find().sort({ createdAt: -1 });
  return res.json({ requests });
};

module.exports = { registerStudent, getAllStudents };
