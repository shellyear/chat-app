import mongoose from "mongoose";

const usernameSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  type: { type: String, enum: ["user", "group", "channel"], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("Username", usernameSchema);
