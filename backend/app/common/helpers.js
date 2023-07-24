const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const niv = require("node-input-validator");
const mongoose = require("mongoose");
const crypto = require("crypto");

const bcryptMake = async (string) => {
  if (string) {
    return bcrypt.hash(string, parseInt(global.CONFIG.bcrypt.saltrounds));
  } else {
    return false;
  }
};

const bcryptCheck = async (string, hash) => {
  if (string && hash) {
    return bcrypt.compareSync(string, hash);
  } else {
    return false;
  }
};

const generateRandomString = async (length = 10) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
const uploadFile = async () => {
  try {
  } catch (error) {
    return res.status(200).send({
      status: "error",
      message: error ? error.message : "Internal Server Error",
      data: data,
    });
  }
};

const generateJwtToken = async (document) => {
  const authtoken = jwt.sign(document, process.env.JWT_SECRET);
  return authtoken;
};

const validator = async (rules, request) => {
  for (const key in rules) {
    if (Object.hasOwnProperty.call(rules, key)) {
      const rule = rules[key];

      if (rule.includes("sometimes")) {
        // If sometimes rule is present
        if (!request[key]) {
          // If the value not present, then skip the rule
          delete rules[key];
        }
      }
    }
  }

  const v = new niv.Validator(request, rules);
  const matched = await v.check();
  if (!matched) {
    return { status: false, errors: v.errors };
  } else {
    return { status: true };
  }
};

const sendSms = async (content, mobile) => {
  console.log("---- OTP SEND : " + mobile + " -> " + content);
  return true;
};

const generateRandNumber = async (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateToken = async (length) => {
  return crypto.randomBytes(length).toString("hex");
};

niv.extend("unique", async ({ value, args }) => {
  const field = args[1];

  let condition = {};

  condition[field] = value;

  // add ignore condition
  if (args[2]) {
    condition["_id"] = { $ne: new mongoose.Types.ObjectId(args[2]) };
  }

  let rowExists = await mongoose
    .model(args[0])
    .findOne(condition)
    .select(field);
  if (rowExists) {
    return false;
  }

  return true;
});

niv.extend("exists", async ({ value, args }) => {
  const field = args[1];

  let condition = {};

  condition[field] = value;

  let rowExists = await mongoose
    .model(args[0])
    .findOne(condition)
    .select(field);
  if (rowExists) {
    return true;
  }

  return false;
});

module.exports = {
  bcryptMake,
  bcryptCheck,
  generateRandomString,
  uploadFile,
  generateJwtToken,
  validator,
  sendSms,
  generateRandNumber,
  generateToken,
};
