const express = require("express");

const rewiewRatingController = require("../controllers/reviewRatingController");
const router = express.Router();

router
  .route("/")
  .get(rewiewRatingController.getAverageRating)
  .post(rewiewRatingController.createReview);
// router
//   .route("/:id")
//   .get(rewiewRatingController.getCatagoryById)
//   .delete(rewiewRatingController.deleteCatagory);

module.exports = router;
