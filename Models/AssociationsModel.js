const mongoose = require("mongoose");

const AssociationModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    /* role: {
    type:String, 
    enum: ["user","company"] 
    }, */
    region: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
    request: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RequestAdoption",
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
