const User = require("../../models/User");
const UserResource = require("../../resources/UserResource");
const helpers = require("../../common/helpers");
const UserEmailVerification = require("../../models/UserEmailVerification");
const mailert = require("../../../utils/sendEmail");

module.exports = {
  login: async (req, res) => {
    let data = {};
    const { email, password } = req.body;
    try {
      let rules = {
        email: `required|email`,
        password: `required|length:${global.CONFIG.rules.password.maxlength},${global.CONFIG.rules.password.minlength}`,
      };

      const v = await helpers.validator(rules, req.body);
      if (!v.status) {
        data.errors = v.errors;
        return res.status(200).json({
          status: "val_error",
          message: "Validation Error",
          data: data,
        });
      }
      let user = null;
      await User.findOne({ email: email, role: "superadmin" }, "")
        .exec()
        .then(function (details) {
          return (user = details);
        })
        .catch(function (e) {
          res.status(200).json({
            status: "error",
            message: e ? e.message : "DB Error Occured",
            data: data,
          });
          process.exit(1);
        });

      if (!user) {
        return res.status(200).json({
          status: "error",
          message: "Please try to login with correct credentials",
          data: data,
        });
      }

      const passwordCompare = await helpers.bcryptCheck(
        password,
        user.password
      );

      if (!passwordCompare) {
        return res.status(200).json({
          status: "error",
          message: "Please try to login with correct credentials",
          data: data,
        });
      }

      if (user.status != "active") {
        return res.status(200).json({
          status: "error",
          message: "The account has been blocked",
          data: data,
        });
      }

      data.user = new UserResource(user).exec();
      data.token = await helpers.generateJwtToken({
        user_id: user._id,
        email: user.email,
        role: user.role,
      });

      return res.status(200).send({
        status: "200",
        data: data,
        message: "Login Successfully",
      });
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: error ? error.message : "Internal Server Error",
        data: data,
      });
    }
  },

  getAccountDetails: async (req, res) => {
    let data = {};
    try {
      let user = await User.findById(req.auth.id).select("-password");
      data = new UserResource(user).exec();
      return res
        .status(200)
        .send({ status: "success", message: "Success", data: user });
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: error ? error.message : "Internal Server Error",
        data: data,
      });
    }
  },

  forgot_password: async (req, res) => {
    let data = {};
    try {
      let rules = {
        email: `required|email`,
      };

      const v = await helpers.validator(rules, req.body);
      if (!v.status) {
        data.errors = v.errors;
        return res.status(200).json({
          status: "val_error",
          message: "Validation Error",
          data: data,
        });
      }

      const { email } = req.body;

      let user = null;
      await User.findOne({ email: email, role: "superadmin" }, "")
        .exec()
        .then(function (details) {
          return (user = details);
        })
        .catch(function (e) {
          res.status(200).json({
            status: "error",
            message: e ? e.message : "DB Error Occured",
            data: data,
          });
          process.exit(1);
        });

      if (!user) {
        return res.status(200).json({
          status: "error",
          message: "The email you entered is invalid",
          data: data,
        });
      }

      const token = await UserEmailVerification.findOne({ userId: user._id });
      if (!token) {
        token = await new UserEmailVerification({
          user_id: user._id,
          email: email,
          token: await helpers.generateToken(32),
        }).save();
      }

      const link = `${process.env.SERVER_BASEPATH}/auth/admin/forgot-password/${user._id}/${token.token}`;
      var maildata = {
        to: user.email,
        subject: "Reset password with email verification",
        text: link,
      };
      data = await mailert.sendMail(maildata);
      return res.status(200).send({
        status: "success",
        message: "Send password reset link successfully",
        data: data,
      });
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: error ? error.message : "Internal Server Error",
        data: data,
      });
    }
  },

  new_password: async (req, res) => {
    let data = {};
    try {
      let rules = {
        new_password: `required|length:${global.CONFIG.rules.password.maxlength},${global.CONFIG.rules.password.minlength}`,
        new_password_confirmation: `required|length:${global.CONFIG.rules.password.maxlength},${global.CONFIG.rules.password.minlength}|same:new_password`,
      };

      const v = await helpers.validator(rules, req.body);
      if (!v.status) {
        data.errors = v.errors;
        return res.status(200).json({
          status: "val_error",
          message: "Validation Error",
          data: data,
        });
      }

      const { new_password } = req.body;

      let user = null;
      user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(200).send({
          status: "success",
          message: "Invalid link or expired",
          data: data,
        });
      }

      const token = await UserEmailVerification.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) {
        return res.status(200).send({
          status: "success",
          message: "Invalid link or expired",
          data: data,
        });
      }

      var document = {
        password: await helpers.bcryptMake(new_password),
      };

      await User.updateOne({ _id: user._id }, { $set: document })
        .then(async () => {
          await UserEmailVerification.deleteOne();
          return res.status(200).send({
            status: "success",
            message: "New password set successfully",
            data: data,
          });
        })
        .catch((error) => {
          res.status(200).send({
            status: "error",
            message: error ? error.message : "DB Error Occured",
            data: data,
          });
          process.exit(1);
        });
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: error ? error.message : "Internal Server Error",
        data: data,
      });
    }
  },
};
