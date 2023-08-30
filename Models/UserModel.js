const mongoose = require("mongoose");

const UserModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    address: {
      type: String,
    },
    birthdayDate: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true, //mette data di modifica
    strict: true, // nessun campo differente dal payload
  }
);

module.exports = mongoose.model("User", UserModelSchema, "users");
