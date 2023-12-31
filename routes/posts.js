const express = require("express");
const PostImg = require("../middlewares/UploadCloudinary");
const AssociationModel = require("../Models/AssociationsModel");
const PostModel = require("../Models/PostModel");

const router = express.Router();

// Chiamata GET per avere tutti i post + paginazione
router.get("/posts", async (req, res) => {
  const { page = 1, pageSize = 8 } = req.query;

  try {
    const post = await PostModel.find()
      .populate("association")
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const totalPost = await PostModel.count();

    res.status(200).send({
      statusCode: 200,
      totalPost: totalPost,
      totalPages: Math.ceil(totalPost / pageSize),
      currentPage: +page,
      pageSize: +pageSize,
      post: post,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error!",
      error,
    });
  }
});

//GET PER FILTRARE POST PER REGIONE
router.get("/posts/filterRegion", async (req, res) => {
  const { page = 1, pageSize = 12 } = req.query;
  console.log(req.query);

  try {
    const post = await PostModel.find({
      location: { $regex: new RegExp(req.query.region, "i") },
    })
      .populate("association")
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const totalPost = await PostModel.count();

    res.status(200).send({
      statusCode: 200,
      totalPost: totalPost,
      totalPages: Math.ceil(totalPost / pageSize),
      currentPage: +page,
      pageSize: +pageSize,
      post: post,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error!",
      error,
    });
  }
});

//chiamata per creare un nuovo post
router.post(
  "/posts/create",
  PostImg.single("image"),

  async (req, res) => {
    const user = await AssociationModel.findOne({ _id: req.body.association });
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: " user not found!!",
      });
    }

    const newPost = new PostModel({
      typeAnimal: req.body.typeAnimal,
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      dimension: req.body.dimension,
      location: req.body.location,
      city: req.body.city,
      image: req.file.path,
      association: user._id,
      content: req.body.content,
    });
    try {
      const post = await newPost.save();
      await AssociationModel.updateOne(
        { _id: user._id },
        { $push: { posts: post } }
      );
      res.status(201).send({
        statusCode: 201,
        message: "Post added!",
        payload: post,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error!",
        error,
      });
    }
  }
);

//Chiamata get per cercare il post con ID
router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const PostsById = await PostModel.findById(id).populate("association");

    res.status(200).send({
      statusCode: 200,
      PostsById,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server Error",
      error,
    });
  }
});

//chiamata PATCH per modificare un post
router.patch("/posts/change/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const postExsist = await PostModel.findById(id);

    if (!postExsist) {
      return res.status(404).send({
        statusCode: 404,
        message: ` Post with ${id} not found!`,
      });
    }

    const dataToUpdate = req.body;
    const options = { new: true };

    const result = await PostModel.findByIdAndUpdate(id, dataToUpdate, options);

    res.status(200).send({
      statusCode: 200,
      message: "Post Modificato Correttamente!",
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore nella chiamata patch dei Post!",
      error,
    });
  }
});

//chiamata DELETE per cancellare un post
router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const postExsist = await PostModel.findById(id);

  if (!postExsist) {
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

//Chiamata GET per cercare i post per ID dell'Associazione

// Chiamata GET per ottenere i post di un'associazione specifica + paginazione
router.get("/posts/association/:associationId", async (req, res) => {
  const { page = 1, pageSize = 6 } = req.query;
  const { associationId } = req.params;

  try {
    const post = await PostModel.find({ association: associationId })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .populate("association");

    const totalPost = await PostModel.count({ association: associationId });

    res.status(200).send({
      statusCode: 200,
      totalPost: totalPost,
      currentPage: +page,
      pageSize: +pageSize,
      post: post,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error!",
      error,
    });
  }
});

module.exports = router;
