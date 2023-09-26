const express = require("express");

const AssociationModel = require("../Models/AssociationsModel");
const PostModel = require("../Models/PostModel");
const bcrypt = require("bcrypt");
const LogoAssociationImg = require("../middlewares/UploadCloudinary");

const router = express.Router();

// Chiamata GET per avere tutte le associazioni
router.get("/associations", async (req, res) => {
  try {
    const association = await AssociationModel.find()
      .populate("posts")
      .populate("reviews");

    const totalAssociation = await AssociationModel.count();

    res.status(200).send({
      statusCode: 200,
      message: " call GET associations successful",
      totalAuthor: totalAssociation,
      users: association,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error!",
      error,
    });
  }
});

//Chiamata POST per REGISTRARE nuova associazione
router.post(
  "/register/associations",
  LogoAssociationImg.single("logo"),
  async (req, res) => {
    const salt = await bcrypt.genSalt(10); // per scegliere complessità algoritmo di protezione password.

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newAssociation = new AssociationModel({
      name: req.body.name,
      region: req.body.region,
      address: req.body.address,
      password: hashedPassword,
      email: req.body.email,
      logo: req.file.path,
      description: req.body.description,
      pIva: req.body.pIva,
    });

    try {
      const association = await newAssociation.save();

      res.status(201).send({
        statusCode: 201,
        message: "Association added successfully!",
        payload: association,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error for add association!",
        error,
      });
    }
  }
);

//Ricerca Associazioni per ID
router.get("/associations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const associationById = await AssociationModel.findById(id)
      .populate("reviews")
      .populate("request");
    res.status(200).send({
      statusCode: 200,
      associationById,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error in the search association ID!",
      error,
    });
  }
});

//DELETE per cancellazzione associazione
router.delete("/associations/:id", async (req, res) => {
  const { id } = req.params;
  const associationExsist = await AssociationModel.findById(id);

  if (!associationExsist) {
    return res.status(404).send({
      statusCode: 404,
      message: ` Association with ${id} not found!`,
    });
  }
  try {
    const associationDelete = await AssociationModel.findByIdAndDelete(id);
    res.status(200).send({
      statusCode: 200,
      associationDelete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Error calling Delete of associations!",
      error,
    });
  }
});

// ...

// Chiamata PATCH per cambiare l'immagine del logo dell'associazione
router.patch(
  "/associations/changeLogo/:id",
  LogoAssociationImg.single("logo"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const associationExist = await AssociationModel.findById(id);

      if (!associationExist) {
        return res.status(404).send({
          statusCode: 404,
          message: `Association with ID ${id} not found!`,
        });
      }

      const logoPath = req.file.path;

      const updatedAssociation = await associationExist.updateOne(
        { logo: logoPath },
        { new: true }
      );

      res.status(201).send({
        statusCode: 201,
        message: "Association logo updated successfully!",
        updatedAssociation,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Error updating association logo!",
        error,
      });
    }
  }
);

// ...

//PATCH per modificare informazioni dell'associazione
router.patch("/associations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const associationExsist = await AssociationModel.findById(id);

    if (!associationExsist) {
      return res.status(404).send({
        statusCode: 404,
        message: ` Association with ${id} not found!`,
      });
    }
    const dataToUpdate = req.body;
    const options = { new: true };

    const result = await AssociationModel.findByIdAndUpdate(
      id,
      dataToUpdate,
      options
    );

    res.status(201).send({
      statusCode: 201,
      message: "Change association information successful!!",
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Error calling PATCH of associations!",
      error,
    });
  }
});

module.exports = router;
