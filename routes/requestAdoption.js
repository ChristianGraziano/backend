const express = require("express");

const RequestAdoptionModel = require("../Models/RequestAdoptionModel");
const bcrypt = require("bcrypt");
const AvatarUserImg = require("../middlewares/UploadCloudinary");

const router = express.Router();

router.post("/requestAdoption/create", async (req, res) => {
  AvatarUserImg.single("avatar");

  const newRequest = new RequestAdoptionModel({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    birthdayDate: req.body.birthdayDate,
    avatar: req.file.path,
    associationId: req.file.associationId,
    postId: req.body.postId,
  });
  try {
    const request = await newRequest.save();
    res.status(201).send({
      statusCode: 201,
      message: "New request for adoption Successfully Created!",
      payload: request,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error in the call POST for request adoption",
      error,
    });
  }
});

module.exports = router;
