const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/login", async (req, res) => {
  try {
    const { walletAddress, githubId, username, email } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({ walletAddress, githubId, username, email });
      await user.save();
    } else {
      // Optionally update fields
      user.githubId = githubId || user.githubId;
      user.username = username || user.username;
      user.email = email || user.email;
      await user.save();
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
