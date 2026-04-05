const Tutor = require("../models/Tutor");

const registerTutor = async (req, res) => {
  const request = await Tutor.create(req.body);
  return res.status(201).json({ message: "Tutor request saved successfully.", request });
};

const getAllTutors = async (_req, res) => {
  const requests = await Tutor.find().sort({ createdAt: -1 });
  return res.json({ requests });
};

module.exports = { registerTutor, getAllTutors };
