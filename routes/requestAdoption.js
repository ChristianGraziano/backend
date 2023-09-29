const express = require("express");
const AssociationModel = require("../Models/AssociationsModel");
const RequestAdoptionModel = require("../Models/RequestAdoptionModel");
const bcrypt = require("bcrypt");
const AvatarUserImg = require("../middlewares/UploadCloudinary");

const router = express.Router();

//Chiamata POST per creare una richiesta
router.post(
  "/requestAdoption/create",
  AvatarUserImg.single("avatar"),
  async (req, res) => {
    const association = await AssociationModel.findById(req.body.associationId);
    const newRequest = new RequestAdoptionModel({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      birthdayDate: req.body.birthdayDate,
      fiscalCode: req.body.fiscalCode,
      avatar: req.file.path,
      motivation: req.body.motivation,
      associationId: req.body.associationId,
      postId: req.body.postId,
    });
    try {
      const request = await newRequest.save();
      await association.updateOne({ $push: { request: newRequest } });
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
  }
);

//Chiamata GET per avere tutte le richieste relativi all'ID dell'associazione
router.get("/requestAdoption/association/:associationId", async (req, res) => {
  try {
    const requestAssociation = await RequestAdoptionModel.find({
      associationId: req.params.associationId,
    });

    if (!requestAssociation || requestAssociation.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No request Found for this post",
      });
    }

    res.status(200).send({
      statusCode: 200,
      totalCount: requestAssociation.length,
      requestAssociation,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

router.delete("/requestAdoption/:id", async (req, res) => {
  const { id } = req.params;
  const requestExsist = await RequestAdoptionModel.findById(id);

  if (!requestExsist) {
    return res.status(404).send({
      statusCode: 404,
      message: ` Post with ${id} not found!`,
    });
  }
  try {
    const postDelete = await PostModel.findByIdAndDelete(id);
    res.status(200).send({
      statusCode: 200,
      message: "Post eliminato correttamente",
      postDelete,
    });
  } catch {
    res.status(500).send({
      statusCode: 500,
      message: "Errore nella chiamata Delete!",
    });
  }
});

module.exports = router;
