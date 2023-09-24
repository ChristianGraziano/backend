const mongoose = require("mongoose");

const RequestModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    birthdayDate: {
      type: String,
      required: true,
    },
    fiscalCode: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    motivation: {
      type: String,
      required: true,
    },
    associationId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model(
  "RequestAdoption",
  RequestModelSchema,
  "requestAdoption"
);
