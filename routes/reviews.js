const express = require("express");

const ReviewsModel = require("../Models/ReviewsModelSchema");
const AssociationModel = require("../Models/AssociationsModel");
const PostModel = require("../Models/PostModel");

const router = express.Router();

//Chiamata GET per avere tutti i commenti
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await ReviewsModel.find();

    if (!reviews || reviews.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No Comments Found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      TotalComments: reviews.length,
      message: "Call GET for reviews successfully",
      reviews,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error in the call GET in reviews",
      error,
    });
  }
});

//Chiamata GET per avere tutti i commenti relativi all'ID del'associazione
router.get("/reviews/association/:associationId", async (req, res) => {
  try {
    const reviewsAssociation = await ReviewsModel.find({
      associationId: req.params.associationId,
    });

    if (!reviewsAssociation || reviewsAssociation.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No reviews Found for this post",
      });
    }

    res.status(200).send({
      statusCode: 200,
      totalCount: reviewsAssociation.length,
      reviewsAssociation,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

// Chiamata POST per pubblicare una recensione
router.post("/reviews/create", async (req, res) => {
  const association = await AssociationModel.findOne({
    _id: req.body.associationId,
  });

  if (!association) {
    return res.status(404).send({
      statusCode: 404,
      message: " association not found!!",
    });
  }

  const newReview = new ReviewsModel({
    userName: req.body.userName,
    associationId: req.body.associationId,
    content: req.body.content,
    rating: req.body.rating,
  });
  try {
    const review = await newReview.save();
    await association.updateOne({ $push: { reviews: review } });
    res.status(201).send({
      statusCode: 201,
      message: "New Reviews Successfully Created!",
      payload: review,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error in the call POST in reviews",
      error,
    });
  }
});

// PATCH per modificare la recensione

router.patch("/reviews/:reviewsId", async (req, res) => {
  const { reviewsId } = req.params;
  const reviewsExist = await ReviewsModel.findById(reviewsId);

  if (!reviewsExist) {
    return res.status(404).send({
      statuscode: 404,
      message: `reviews with id ${reviewsId} not found!`,
    });
  }

  try {
    const dataUpdate = req.body;
    const options = { new: true };

    const result = await ReviewsModel.findByIdAndUpdate(
      reviewsId,
      dataUpdate,
      options
    );

    res.status(200).send({
      statusCode: 200,
      message: "Updated reviews successfully!",
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error in the call PATCH comment ",
      error,
    });
  }
});

// DELETE per eliminare un commento

router.delete("/reviews/:reviewsId", async (req, res) => {
  const { reviewsId } = req.params;
  const reviewsExist = await ReviewsModel.findById(reviewsId);

  if (!reviewsExist) {
    return res.status(404).send({
      statuscode: 404,
      message: `Comment with id ${reviewsId} not found!`,
    });
  }

  try {
    const DeleteReviews = await ReviewsModel.findByIdAndDelete(reviewsId);
    res.status(200).send({
      statusCode: 200,
      message: `Comment with id ${reviewsId} deleted successfully`,
      DeleteReviews,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error in the call DELETE comment",
      error,
    });
  }
});

module.exports = router;
