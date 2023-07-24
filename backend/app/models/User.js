const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["superadmin", "employee"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: false,
    default: null,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    required: true,
    default: "active",
  },
  email_verified_at: {
    type: Date,
    required: false,
    default: null,
  },
  mobile_verified_at: {
    type: Date,
    required: false,
    default: null,
  },
  
},{
  timestamps:true,versionKey:false
});

userSchema.plugin(aggregatePaginate, mongoosePaginate);
const User = mongoose.model("users", userSchema);
module.exports = User;
