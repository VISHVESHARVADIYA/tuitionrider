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

const getMatchSuggestions = async (_req, res) => {
  const students = await Student.find({ matchStatus: { $ne: "contracted" } }).sort({ createdAt: -1 });
  const tutors = await Tutor.find({ matchStatus: { $ne: "contracted" } }).sort({ createdAt: -1 });

  const suggestions = [];

  students.forEach((student) => {
    tutors.forEach((tutor) => {
      if (tutor.fees <= student.budget) {
        const score = Math.round(
          Math.max(0, 100 - Math.abs(student.budget - tutor.fees) / Math.max(student.budget, 1) * 100)
        );

        suggestions.push({
          student,
          tutor,
          score,
        });
      }
    });
  });

  suggestions.sort((a, b) => b.score - a.score);

  return res.json({ suggestions: suggestions.slice(0, 20) });
};

const createMatch = async (req, res) => {
  const { studentId, tutorId } = req.body;

  const student = await Student.findById(studentId);
  const tutor = await Tutor.findById(tutorId);

  if (!student || !tutor) {
    return res.status(404).json({ message: "Student or tutor not found." });
  }

  if (student.matchStatus === "contracted" || tutor.matchStatus === "contracted") {
    return res.status(400).json({ message: "One of the requests is already matched." });
  }

  student.matchStatus = "contracted";
  student.contacted = true;
  student.matchedTutor = {
    id: tutor._id.toString(),
    name: tutor.name,
    email: tutor.email,
    phone: tutor.phone,
    qualification: tutor.qualification,
    fees: tutor.fees,
  };

  tutor.matchStatus = "contracted";
  tutor.contacted = true;
  tutor.matchedStudent = {
    id: student._id.toString(),
    name: student.name,
    email: student.email,
    parentContact: student.parentContact,
    class: student.class,
    budget: student.budget,
  };

  await Promise.all([student.save(), tutor.save()]);

  return res.json({
    message: "Match created successfully.",
    student,
    tutor,
  });
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

module.exports = { getStudents, getTutors, getMatchSuggestions, createMatch, markContacted, deleteRequest };
