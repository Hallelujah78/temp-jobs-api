const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "please enter a company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "please enter a value for position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
