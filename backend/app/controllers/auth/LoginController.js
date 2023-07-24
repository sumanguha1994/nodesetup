const helpers = require("../../common/helpers");
const { sendMail } = require("../../common/mailer");
const OtpVerification = require("../../models/OtpVerification");
const User = require("../../models/User");
const UserEmailVerification = require("../../models/UserEmailVerification");
const UserResource = require("../../resources/UserResource");

module.exports = {
  submit: async (req, res, otp_verification = false) => {
    let data = {};
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

      const { email, password } = req.body;

      let user = null;
      await User.findOne(
        {
          email: email,
          role: {
            $in: ["employee"],
          },
        },
        ""
      )
        .exec()
        .then((details) => {
          return (user = details);
        })
        .catch(function (error) {
          res.status(200).json({
            status: "error",
            message: error ? error.message : "DB Error Occured",
            data: data,
          });
          process.exit(1);
        });

      if (!user) {
        return res.status(200).send({
          status: "error",
          message: "The email you entered is invalid",
          data: data,
        });
      }

      if (user.status != "active") {
        return res.status(200).send({
          status: "error",
          message: "The account has been blocked",
          data: data,
        });
      }

      if (!(await helpers.bcryptCheck(password, user.password))) {
        return res.status(200).send({
          status: "error",
          message: "The account you entered is invalid",
          data: data,
        });
      }

      // if (user.email_verified_at == null) {
      //   const otp = await helpers.generateRandNumber(111111, 999999);
      //   const content = `${otp} is your one-time password for verifying your account in DEMO. The otp is only valid for 20 min`;

      //   if (helpers.sendSms(content, user.mobile)) {
      //     let otp_document = {
      //       token: await helpers.generateRandomString(60),
      //       // user_id: user._id,
      //       // email: user.email,
      //     };

      //     //   await UserEmailVerification.deleteMany({
      //     //     user_id: otp_document.user_id,
      //     //   }).exec();

      //     await UserEmailVerification.create({ $set: otp_document })
      //       .then(async () => {
      //         return res.status(200).json({
      //           status: "success",
      //           message: "Set successfully",
      //           data: data,
      //         });
      //         //   const send_email = await sendMail({
      //         //     to: document.email,
      //         //     subject: "CYTE - ACCOUNT VERIFICATION",
      //         //     type: "member-account-verification",
      //         //     data: {
      //         //       user_name: req.auth.data.name,
      //         //       user_email: req.auth.data.email,
      //         //       verification_token: details.token,
      //         //     },
      //         //   });
      //       })
      //       .catch((error) => {
      //         return res.status(200).json({
      //           status: "error",
      //           message: error ? error.message : "DB Error Occured",
      //           data: data,
      //         });
      //       });
      //   } else {
      //     return res.status(200).send({
      //       status: "error",
      //       message: "The otp cannot be sent. Please try again later",
      //       data: data,
      //     });
      //   }
      // }

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
};
