const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    subjects: [{ type: String, required: true, trim: true }],
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    fees: { type: Number, required: true },
    contacted: { type: Boolean, default: false },
    matchStatus: { type: String, enum: ["pending", "contracted"], default: "pending" },
    matchedStudent: {
      id: { type: String },
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      parentContact: { type: String, trim: true },
      class: { type: String, trim: true },
      budget: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tutor", tutorSchema);
