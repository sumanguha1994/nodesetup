const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const mongoDBUrl = `mongodb://${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose
  .connect(mongoDBUrl, {})
  .then(() => console.log("Database Connected at " + mongoDBUrl))
  .catch((error) => console.log(error));

module.exports = mongoose;
