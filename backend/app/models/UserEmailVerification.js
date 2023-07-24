const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const UserEmailVerificationSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
    expires: "1m",
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  email: {
    type: String,
    required: true,
  },
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

UserEmailVerificationSchema.plugin(mongoosePaginate);

const UserEmailVerification = mongoose.model(
  "user_email_verifications",
  UserEmailVerificationSchema
);

module.exports = UserEmailVerification;
