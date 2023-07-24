const User = require("../../models/User");
const helpers = require("../../common/helpers");
const UserResource = require("../../resources/UserResource");

module.exports = {
  edit: async (req, res) => {
    let data = {};
    try {
      let rules = null;
      switch (req.body.operation) {
        case "basicdetails":
          rules = {
            name: `required`,
            email: `required|email|unique:users,email,` + req.auth.id,
            mobile: `required|phoneNumber|unique:users,mobile,` + req.auth.id,
          };
          break;

        case "password":
          rules = {
            current_password: `required|length:${global.CONFIG.rules.password.maxlength},${global.CONFIG.rules.password.minlength}`,
            new_password: `required|length:${global.CONFIG.rules.password.maxlength},${global.CONFIG.rules.password.minlength}`,
            new_password_confirmation: `required|length:${global.CONFIG.rules.password.maxlength},${global.CONFIG.rules.password.minlength}|same:new_password`,
          };
          break;

        default:
          return req.status(404).send({
            status: "error",
            message: "Invalid Request Received",
            data: data,
          });
      }

      if (rules) {
        const v = await helpers.validator(rules, req.body);
        if (!v.status) {
          data.errors = v.errors;
          return res.status(200).json({
            status: "val_error",
            message: "Validation Error",
            data: data,
          });
        }
      }

      const { name, email, mobile, current_password, new_password } = req.body;

      let action = false;
      let successmsg = null;
      switch (req.body.operation) {
        case "basicdetails":
          var document = {
            name: name,
            email: email,
            mobile: mobile,
            updated_at: Date.now(),
          };

          await User.updateOne({ _id: req.auth.id }, { $set: document })
            .then(() => {
              action = true;
              successmsg = "Profile updated successfully";
            })
            .catch((error) => {
              res.status(200).send({
                status: "error",
                message: error ? error.message : "DB Error Occured",
                data: data,
              });
              process.exit(1);
            });

          break;

        case "password":
          if (
            !(await helpers.bcryptCheck(
              current_password,
              req.auth.data.password
            ))
          ) {
            return res.status(200).json({
              status: "error",
              message: "The current password you entered is invalid",
              data: data,
            });
          }

          var document = {
            password: await helpers.bcryptMake(new_password),
          };

          await User.updateOne({ _id: req.auth.id }, { $set: document })
            .then(() => {
              action = true;
              successmsg = "Password changed successfully";
            })
            .catch((error) => {
              res.status(200).send({
                status: "error",
                message: error ? error.message : "DB Error Occured",
                data: data,
              });
              process.exit(1);
            });

          break;

        default:
          return res.status(404).send({
            status: "error",
            message: "Invalid Request Received1",
            data: data,
          });
      }

      if (action) {
        data.user = null;
        await User.findOne({ _id: req.auth.id })
          .exec()
          .then((user) => {
            return (data.user = new UserResource(user).exec());
          });

        return res.status(200).send({
          status: "success",
          message: successmsg ? successmsg : "Profile Updated Successfully",
          data: data,
        });
      } else {
        return res.status(400).send({
          status: "error",
          message: "Invalid Request Received2",
          data: data,
        });
      }
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: error ? error.message : "Internal Server Error",
        data: data,
      });
    }
  },
};
