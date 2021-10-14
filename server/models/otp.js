const mongoose = require("mongoose");

const otp = new mongoose.Schema({
  phone: {
    type: Number,
  },
  otp: {
    type: Number,
  },
  email: {
    type: String,
  },
});

const OtpData = (module.exports = mongoose.model("optData", otp));
