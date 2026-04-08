const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    class: { type: String, required: true, trim: true },
    parentContact: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    budget: { type: Number, required: true },
    subjects: [{ type: String, required: true, trim: true }],
    contacted: { type: Boolean, default: false },
    matchStatus: { type: String, enum: ["pending", "contracted"], default: "pending" },
    matchedTutor: {
      id: { type: String },
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      qualification: { type: String, trim: true },
      fees: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
