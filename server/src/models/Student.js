const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    class: { type: String, required: true, trim: true },
    parentContact: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    budget: { type: Number, required: true },
    contacted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
