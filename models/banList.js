const mongoose = require("mongoose");

const banSchema = new mongoose.Schema({
  userId: String,
  reason: String,
  bannedBy: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BanList", banSchema);
