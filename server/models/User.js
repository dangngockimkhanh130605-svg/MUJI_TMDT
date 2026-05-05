const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  newsletter: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpire: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);