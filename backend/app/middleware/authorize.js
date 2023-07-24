const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  checkAuth: function (req, res, next) {
    let data = {};
    try {
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(401).send({
          status: "unauthenticated",
          message: "Authorization token not provided",
          data: data,
        });
      }

      jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).send({
            status: "unauthenticated",
            message:
              "Unauthentication Action : " + (err ? err.message : "UNTRACABLE"),
            data: data,
          });
        }

        req.auth = {};
        req.auth.id = decoded.user_id;
        req.auth.data = decoded;

        await User.findOne({ _id: req.auth.id })
          .exec()
          .then(function (user) {
            req.auth.data = user;
          });

        if (!req.auth.data) {
          return res.status(401).send({
            status: "unauthenticated",
            message: "Session Expired!! Please signin again to continue",
            data: data,
          });
        }

        next();
      });
    } catch (e) {
      return res.status(200).send({
        status: "error",
        message: e ? e.message : "Something went wrong",
        data: data,
      });
    }
  },

  checkRole(accepted_role) {
    return function (req, res, next) {
      let data = {};
      try {
        const token = req.headers["x-access-token"];
        if (!token) {
          return res.status(401).send({
            status: "unauthenticated",
            message: "Authorization token not provided",
            data: data,
          });
        }

        jwt.verify(
          token,
          process.env.JWT_SECRET,
          async function (err, decoded) {
            if (err) {
              return res.status(401).send({
                status: "unauthenticated",
                message:
                  "Unauthentication Action : " +
                  (err ? err.message : "UNTRACABLE"),
                data: data,
              });
            }

            let user = null;
            await User.findOne({ _id: req.auth.id }, "")
              .exec()
              .then(function (details) {
                return (user = details);
              });

            if (!user) {
              return res.status(401).send({
                status: "unauthenticated",
                message: "Session Expired!! Please signin again to continue",
                data: data,
              });
            }

            if (
              Array.isArray(accepted_role) &&
              accepted_role.includes(user.role)
            ) {
              next();
            } else if (accepted_role == user.role) {
              next();
            } else {
              return res.status(200).send({
                status: "error",
                message: "Oops!! Permission denied",
                data: data,
              });
            }
          }
        );
      } catch (e) {
        return res.status(200).send({
          status: "error",
          message: e ? e.message : "Something went wrong",
          data: data,
        });
      }
    };
  },
};
