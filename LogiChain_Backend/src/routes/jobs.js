const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { userAddress, repoUrl, commitHash, buildConfig } = req.body;

    if (!userAddress || !repoUrl || !commitHash || !buildConfig) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const job = new Job({
      userAddress,
      repoUrl,
      commitHash,
      buildConfig,
      status: "queued",
    });

    await job.save();

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status, artifactsUrl, attestationHash } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (status) job.status = status;
    if (artifactsUrl) job.artifactsUrl = artifactsUrl;
    if (attestationHash) job.attestationHash = attestationHash;

    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
