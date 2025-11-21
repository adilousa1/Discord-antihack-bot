const mongoose = require("mongoose");

module.exports = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO);
  console.log("Connected to MongoDB");
};
