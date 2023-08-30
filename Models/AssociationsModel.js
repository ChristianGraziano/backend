const mongoose = require("mongoose");

const AssociationModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    region: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
    pIva: {
      type: Number,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        default: [],
      },
    ],
  },
  {
    timestamps: true, //mette data di modifica
    strict: true, // nessun campo differente dal payload
  }
);

module.exports = mongoose.model(
  "Association",
  AssociationModelSchema,
  "associations"
);
