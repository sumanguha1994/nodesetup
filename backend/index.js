const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const AuthMiddleware = require("./app/middleware/authorize");

const path = require("path");
const cors = require("cors");

// Importing Configuration files to Global
global.CONFIG = {
  bcrypt: require("./config/bcrypt"),
  app: require("./config/app"),
  rules: require("./config/rules"),
  mail: require("./config/mail"),
};

const mongoose = require("./config/db.config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", express.static(path.join(__dirname, "public")));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use(
  "/api/admin",
  AuthMiddleware.checkAuth,
  AuthMiddleware.checkRole(["superadmin"]),
  require("./routes/admin")
);
app.use(
  "/api/user",
  AuthMiddleware.checkAuth,
  AuthMiddleware.checkRole(["employee"]),
  require("./routes/user")
);

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOSTNAME, () => {
  console.log(
    `Server running on http://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/api`
  );
});
