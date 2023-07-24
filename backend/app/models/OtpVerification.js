const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const OtpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    default: null,
  },
  mobile: {
    type: String,
    required: false,
    default: null,
  },
  otp: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["user-register", "user-login"],
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  data: Schema.Types.Mixed,
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

OtpVerificationSchema.plugin(mongoosePaginate);

const OtpVerification = mongoose.model(
  "otp_verifications",
  OtpVerificationSchema
);

module.exports = OtpVerification;
