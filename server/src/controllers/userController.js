const Student = require("../models/Student");
const Tutor = require("../models/Tutor");

const getProfile = async (req, res) => {
  const email = req.user?.email;
  if (!email) {
    return res.status(400).json({ message: "Unable to find user email." });
  }

  const [studentRequests, tutorRequests] = await Promise.all([
    Student.find({ email }).sort({ createdAt: -1 }),
    Tutor.find({ email }).sort({ createdAt: -1 }),
  ]);

  return res.json({
    user: {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
    studentRequests,
    tutorRequests,
  });
};

module.exports = { getProfile };
