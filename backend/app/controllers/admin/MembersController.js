const helpers = require("../../common/helpers");
const User = require("../../models/User");
const UserResource = require("../../resources/UserResource");

module.exports = {
  add: async (req, res) => {
    let data = {};
    try {
      let rules = {
        name: `required`,
        email: `required|email|unique:users,email,` + req.auth.id,
        mobile: `required|phoneNumber|unique:users,mobile,` + req.auth.id,
      };

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

      const { role, name, email, mobile } = req.body;
      const randomPassword = await helpers.generateRandomString(10);

      const user = await User.create({
        role: role,
        name: name,
        email: email,
        mobile: mobile,
        password: await helpers.bcryptMake(randomPassword),
        image: "default.png",
      })
        .then(function (row) {
          return row;
        })
        .catch(function (error) {
          res.status(200).json({
            status: "error",
            message: error ? error.message : "DB Error Occured",
            data: data,
          });
          process.exit(1);
        });

      data = new UserResource(user).exec();

      return res.status(200).json({
        status: "success",
        message: "Member account created successfully",
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

  view: async (req, res) => {
    let data = {};
    try {
      let rules = {
        page: `required|numeric`,
        searchkey: `nullable`,
        limit: `nullable`,
      };

      const v = await helpers.validator(rules, req.query);
      if (!v.status) {
        data.errors = v.errors;
        return res.status(200).json({
          status: "val_error",
          message: "Validation Error",
          data: data,
        });
      }

      const { page, limit, sort, searchkey } = req.query;

      const pagination = {
        page: page || 1,
        limit: limit || global.CONFIG.app.pagination.perpage,
        sort: sort,
        skipIndex: (page - 1) * limit,
      };

      // const page = Number(req.query.page) || 1;
      // const limit =
      //   Number(req.query.limit) || global.CONFIG.app.pagination.perpage;
      // const sort = req.query.sort;
      // const skipIndex = (page - 1) * limit;

      // let filter_option = {
      //   $match: {
      //     $and: [{ role: req.body.role }],
      //   },
      // };

      // if (searchkey) {
      //   filter_option.$match.$or = [
      //     { name: { $regex: ".*" + searchkey + ".*" } },
      //     { email: { $regex: ".*" + searchkey + ".*" } },
      //     { mobile: { $regex: ".*" + searchkey + ".*" } },
      //   ];
      // }

      const count = await User.count({
        status: ["active", "inactive"],
      });
      // let userAggregrate = User.aggregate({ filter_option });
      let userAggregrate = User.aggregate();
      await User.aggregatePaginate({
        userAggregrate,
        pagination,
      })
        .then((rows) => {
          data.users = UserResource.collection(rows.docs);
          return res.status(200).send({
            status: "success",
            message: "Members fetched successfully",
            data: data,
            pageNumber: page,
            pageSize: limit,
            totalElements: count,
            totalPages: Math.ceil(count / limit),
            lastPage: "",
          });
        })
        .catch((error) => {
          res.status(200).json({
            status: "error",
            message: error ? error.message : "DB Error Occured",
            data: data,
          });
          process.exit(1);
        });
      // .sort(sort)
      // .limit(limit)
      // .skip(skipIndex)
      // .exec();

      // data = UserResource.collection(user);
      // return res.status(200).send({
      //   status: "success",
      //   message: "Members fetched successfully",
      //   data: data,
      //   pageNumber: page,
      //   pageSize: limit,
      //   totalElements: count,
      //   totalPages: Math.ceil(count / limit),
      //   lastPage: "",
      // });
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: error ? error.message : "Internal Server Error",
        data: data,
      });
    }
  },

  edit: async (req, res) => {
    let data = {};
    try {
      let rules = {
        name: `required`,
        email: `required|email|unique:users,email,` + req.auth.id,
        mobile: `required|phoneNumber|unique:users,mobile,` + req.auth.id,
      };

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

      const { name, email, mobile, password } = req.body;

      let user = await User.findOne({ _id: req.body.user_id })
        .exec()
        .then(function (row) {
          return row;
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
        return res
          .status(404)
          .send({ status: "error", message: "User Not Found", data: data });
      }

      if (!["employee"].includes(user.role)) {
        return res.status(200).send({
          status: "error",
          message: "Unauthorized Action",
          data: data,
        });
      }
      let successmsg = "Member account updated successfully";
      let action = false;
      switch (req.body.operation) {
        case "basicdetails":
          var document = {
            name: name,
            email: email,
            mobile: mobile,
            updated_at: Date.now(),
          };

          await User.updateOne({ _id: req.body.user_id }, { $set: document })
            .then(function () {
              return res.status(200).send({
                status: "success",
                message: successmsg,
                data: new UserResource(user).exec(),
              });
            })
            .catch(function (error) {
              res.status(200).json({
                status: "error",
                message: error ? error.message : "DB Error Occured",
                data: data,
              });
              process.exit(1);
            });

          break;

        case "password":
          var document = {
            password: await helpers.bcryptMake(password),
          };

          await User.updateOne({ _id: req.body.user_id }, { $set: document })
            .then(() => {
              return res.status(200).send({
                status: "success",
                message: "Member password changed successfully",
                data: new UserResource(user).exec(),
              });
            })
            .catch((error) => {
              res.status(200).json({
                status: "error",
                message: error ? error.message : "DB Error Occured",
                data: data,
              });
              process.exit(1);
            });
          break;

        case "profilepicture":
          var document = {};

          if (req.files && req.files.image !== undefined) {
            const uploadImage = await helpers.uploadFile(
              req.files.image,
              "users/profile",
              ["JPG", "JPEG", "PNG", "jpg", "jpeg", "png"]
            );
            if (uploadImage.status == false) {
              return resp.status(200).json({
                status: "error",
                message: "File upload error : " + uploadImage.message,
                data: data,
              });
            }

            if (user_details.image) {
              await helpers.deleteFile(user_details.image, "users/profile");
            }

            document.image = uploadImage.filename;
          } else {
            return resp.status(200).json({
              status: "error",
              message: "Please select a image to upload.",
              data: data,
            });
          }

          await User.updateOne(
            { _id: user_details._id },
            document,
            function (err, details) {
              if (err) {
                res.status(200).send({
                  status: "error",
                  message: err ? err.message : "DB Error Occured",
                  data: data,
                });
                process.exit(1);
              }

              action = true;
              successmsg = "Profile Picture Updated Successfully";
            }
          );
          break;

        default:
          return res.status(404).send({
            status: "error",
            message: "Invalid Request Received",
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

  changeStatus: async (req, res) => {
    let data = {};
    try {
      let user_details = await User.findOne({ _id: req.body.user_id })
        .exec()
        .then((row) => {
          return row;
        })
        .catch((error) => {
          res.status(200).json({
            status: "error",
            message: error ? error.message : "DB Error Occured",
            data: data,
          });
          process.exit(1);
        });

      if (!user_details) {
        return res
          .status(404)
          .send({ status: "error", message: "User Not Found", data: data });
      }

      if (!["employee"].includes(user_details.role)) {
        return res.status(200).send({
          status: "error",
          message: "Unauthorized Action",
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

    var document = {
      status: req.body.status,
      updated_at: Date.now(),
    };

    await User.updateOne({ _id: req.body.user_id }, { $set: document })
      .then(() => {
        return res.status(200).send({
          status: "success",
          message: "Member status changed successfully",
          data: data,
        });
      })
      .catch((error) => {
        res.status(200).json({
          status: "error",
          message: error ? error.message : "DB Error Occured",
          data: data,
        });
        process.exit(1);
      });
  },
};
