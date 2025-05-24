const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  repoName: {
    type: String,
    required: true,
  },
  commitHash: {
    type: String,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["queued", "in_progress", "completed", "failed"],
    default: "queued",
  },
  buildLogs: {
    type: String,
    default: "",
  },
  buildArtifacts: {
    type: [String],
    default: [],
  },
  attestationHash: {
    type: String,
    default: "",
  },
  runnerId: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", jobSchema);
