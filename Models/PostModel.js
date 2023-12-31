const mongoose = require("mongoose");

const PostModelSchema = new mongoose.Schema(
  {
    typeAnimal: {
      type: String,
    },
    name: {
      type: String,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
    dimension: {
      type: String,
    },
    location: {
      type: String,
    },
    city: {
      type: String,
    },
    image: {
      type: String,
    },
    association: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Association",
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Post", PostModelSchema, "posts");
