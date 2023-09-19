const mongoose = require("mongoose");

const ReviewModelSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    associationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Association",
    },
    content: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      default: 1,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Review", ReviewModelSchema, "reviews");
