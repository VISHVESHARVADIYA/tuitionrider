const Student = require("../models/Student");

const registerStudent = async (req, res) => {
  const request = await Student.create(req.body);
  return res.status(201).json({ message: "Student request saved successfully.", request });
};

const getAllStudents = async (_req, res) => {
  const requests = await Student.find().sort({ createdAt: -1 });
  return res.json({ requests });
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Allow updating: name, class, parentContact, email, budget, subjects, timeSlot
  const allowedFields = ["name", "class", "parentContact", "email", "budget", "subjects", "timeSlot"];
  const filteredUpdates = Object.keys(updates)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  const request = await Student.findByIdAndUpdate(id, filteredUpdates, { new: true, runValidators: true });

  if (!request) {
    return res.status(404).json({ message: "Student request not found." });
  }

  return res.json({ message: "Student request updated successfully.", request });
};

module.exports = { registerStudent, getAllStudents, updateStudent };
