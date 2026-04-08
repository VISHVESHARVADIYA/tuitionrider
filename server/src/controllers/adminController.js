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
  const tutors = await Tutor.find().sort({ createdAt: -1 });

  const suggestions = [];

  students.forEach((student) => {
    tutors.forEach((tutor) => {
      if (tutor.fees <= student.budget) {
        const studentSubjects = (student.subjects || []).map((subject) => subject.toLowerCase().trim());
        const tutorSubjects = (tutor.subjects || []).map((subject) => subject.toLowerCase().trim());
        const commonSubjects = studentSubjects.filter((subject) => tutorSubjects.includes(subject));
        const studentSlot = student.timeSlot?.toLowerCase().trim();
        const tutorSlot = tutor.timeSlot?.toLowerCase().trim();

        if (commonSubjects.length && studentSlot && tutorSlot && studentSlot === tutorSlot) {
          const score = Math.min(
            100,
            Math.round(
              Math.max(0, 100 - Math.abs(student.budget - tutor.fees) / Math.max(student.budget, 1) * 100) + 10
            )
          );

          suggestions.push({
            student,
            tutor,
            score,
            subjects: commonSubjects,
          });
        }
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

  if (student.matchStatus === "contracted") {
    return res.status(400).json({ message: "Student request is already matched." });
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
    timeSlot: tutor.timeSlot,
  };

  tutor.contacted = true;
  tutor.matchStatus = "contracted";
  tutor.matchedStudents = tutor.matchedStudents || [];
  tutor.matchedStudents.push({
    id: student._id.toString(),
    name: student.name,
    email: student.email,
    parentContact: student.parentContact,
    class: student.class,
    budget: student.budget,
    timeSlot: student.timeSlot,
    subjects: student.subjects,
  });

  await Promise.all([student.save(), tutor.save()]);

  return res.json({
    message: "Match created successfully.",
    student,
    tutor,
  });
};

const getContractedMatches = async (_req, res) => {
  const students = await Student.find({ matchStatus: "contracted" }).sort({ updatedAt: -1 });
  const matches = students.map((student) => ({
    student: {
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      parentContact: student.parentContact,
      class: student.class,
      budget: student.budget,
      subjects: student.subjects,
      timeSlot: student.timeSlot,
    },
    tutor: student.matchedTutor,
  }));

  return res.json({ matches });
};

const cancelContract = async (req, res) => {
  const { type, id } = req.params;

  if (type === "student") {
    const student = await Student.findById(id);
    if (!student || student.matchStatus !== "contracted" || !student.matchedTutor?.id) {
      return res.status(400).json({ message: "Student is not currently contracted." });
    }

    const tutor = await Tutor.findById(student.matchedTutor.id);
    if (tutor) {
      tutor.matchedStudents = (tutor.matchedStudents || []).filter(
        (entry) => entry.id !== student._id.toString()
      );
      if (!tutor.matchedStudents.length) {
        tutor.matchStatus = "pending";
        tutor.contacted = false;
      }
      await tutor.save();
    }

    student.matchStatus = "pending";
    student.contacted = false;
    student.matchedTutor = undefined;
    await student.save();

    return res.json({ message: "Student contract cancelled.", student, tutor });
  }

  if (type === "tutor") {
    const tutor = await Tutor.findById(id);
    if (!tutor || !(tutor.matchedStudents || []).length) {
      return res.status(400).json({ message: "Tutor has no active contracts to cancel." });
    }

    const matchedIds = tutor.matchedStudents.map((entry) => entry.id);
    await Student.updateMany(
      { _id: { $in: matchedIds } },
      { matchStatus: "pending", contacted: false, matchedTutor: undefined }
    );

    tutor.matchedStudents = [];
    tutor.matchStatus = "pending";
    tutor.contacted = false;
    await tutor.save();

    return res.json({ message: "Tutor contracts cancelled.", tutor });
  }

  return res.status(400).json({ message: "Invalid contract cancellation type." });
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
