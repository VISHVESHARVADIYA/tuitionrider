const Student = require("../models/Student");
const Tutor = require("../models/Tutor");

const parseTimeToMinutes = (timeText) => {
  if (!timeText || typeof timeText !== "string") return null;
  const normalized = timeText.trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
  if (!match) return null;

  const [, hourText, minuteText, meridiem] = match;
  let hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute) || hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    return null;
  }

  if (meridiem === "AM") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return hour * 60 + minute;
};

const parseSlotRange = (slotText) => {
  if (!slotText || typeof slotText !== "string") return null;
  const parts = slotText.split("-").map((part) => part.trim());
  if (parts.length !== 2) return null;

  const start = parseTimeToMinutes(parts[0]);
  const end = parseTimeToMinutes(parts[1]);
  if (start === null || end === null || end <= start) return null;

  return { start, end };
};

const hasSlotOverlap = (slotA, slotB) => {
  const rangeA = parseSlotRange(slotA);
  const rangeB = parseSlotRange(slotB);

  if (!rangeA || !rangeB) {
    return (slotA || "").toLowerCase().trim() === (slotB || "").toLowerCase().trim();
  }

  return rangeA.start < rangeB.end && rangeB.start < rangeA.end;
};

const isTutorAvailableForSlot = (tutor, studentSlot, ignoreStudentId) => {
  const assignedStudents = tutor.matchedStudents || [];
  return assignedStudents.every((entry) => {
    if (ignoreStudentId && entry.id === ignoreStudentId) {
      return true;
    }
    return !hasSlotOverlap(entry.timeSlot, studentSlot);
  });
};

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
  const diagnostics = {
    consideredPairs: 0,
    matchedPairs: 0,
    budgetRejected: 0,
    subjectRejected: 0,
    slotRejected: 0,
    conflictRejected: 0,
  };

  students.forEach((student) => {
    tutors.forEach((tutor) => {
      diagnostics.consideredPairs += 1;
      if (tutor.fees > student.budget) {
        diagnostics.budgetRejected += 1;
        return;
      }

      const studentSubjects = (student.subjects || []).map((subject) => subject.toLowerCase().trim());
      const tutorSubjects = (tutor.subjects || []).map((subject) => subject.toLowerCase().trim());
      const commonSubjects = studentSubjects.filter((subject) => tutorSubjects.includes(subject));

      if (!commonSubjects.length) {
        diagnostics.subjectRejected += 1;
        return;
      }
      if (!hasSlotOverlap(student.timeSlot, tutor.timeSlot)) {
        diagnostics.slotRejected += 1;
        return;
      }
      if (!isTutorAvailableForSlot(tutor, student.timeSlot, student._id.toString())) {
        diagnostics.conflictRejected += 1;
        return;
      }

      const budgetScore = Math.max(
        0,
        100 - (Math.abs(student.budget - tutor.fees) / Math.max(student.budget, 1)) * 100
      );
      const subjectScore = Math.min(30, (commonSubjects.length / Math.max(studentSubjects.length, 1)) * 30);
      const score = Math.min(100, Math.round(budgetScore * 0.6 + subjectScore + 10));
      diagnostics.matchedPairs += 1;

      suggestions.push({
        student,
        tutor,
        score,
        subjects: commonSubjects,
      });
    });
  });

  suggestions.sort((a, b) => b.score - a.score);

  return res.json({ suggestions: suggestions.slice(0, 20), diagnostics });
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

  if (tutor.fees > student.budget) {
    return res.status(400).json({ message: "Tutor fees exceed student budget." });
  }

  const studentSubjects = (student.subjects || []).map((subject) => subject.toLowerCase().trim());
  const tutorSubjects = (tutor.subjects || []).map((subject) => subject.toLowerCase().trim());
  const commonSubjects = studentSubjects.filter((subject) => tutorSubjects.includes(subject));
  if (!commonSubjects.length) {
    return res.status(400).json({ message: "No common subjects between student and tutor." });
  }

  if (!hasSlotOverlap(student.timeSlot, tutor.timeSlot)) {
    return res.status(400).json({ message: "Student and tutor time slots do not overlap." });
  }

  if (!isTutorAvailableForSlot(tutor, student.timeSlot, student._id.toString())) {
    return res.status(400).json({ message: "Tutor already has a contracted student in this time slot." });
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

const clearPendingContracted = async (_req, res) => {
  try {
    const studentResult = await Student.deleteMany({ matchStatus: { $in: ["pending", "contracted"] } });
    const tutorResult = await Tutor.deleteMany({ matchStatus: { $in: ["pending", "contracted"] } });

    return res.json({
      message: "Pending and contracted entries cleared.",
      deletedStudents: studentResult.deletedCount,
      deletedTutors: tutorResult.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error clearing entries.", error: error.message });
  }
};

module.exports = {
  getStudents,
  getTutors,
  getMatchSuggestions,
  createMatch,
  getContractedMatches,
  cancelContract,
  markContacted,
  deleteRequest,
  clearPendingContracted,
};
