const Tutor = require("../models/Tutor");

const registerTutor = async (req, res) => {
  const request = await Tutor.create(req.body);
  return res.status(201).json({ message: "Tutor request saved successfully.", request });
};

const getAllTutors = async (_req, res) => {
  const requests = await Tutor.find().sort({ createdAt: -1 });
  return res.json({ requests });
};

const updateTutor = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Allow updating: name, qualification, subjects, email, phone, fees
  const allowedFields = ["name", "qualification", "subjects", "email", "phone", "fees"];
  const filteredUpdates = Object.keys(updates)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  const request = await Tutor.findByIdAndUpdate(id, filteredUpdates, { new: true, runValidators: true });

  if (!request) {
    return res.status(404).json({ message: "Tutor request not found." });
  }

  return res.json({ message: "Tutor request updated successfully.", request });
};

module.exports = { registerTutor, getAllTutors, updateTutor };
