const express = require("express");
const router = express.Router({ mergeParams: true }); //merge id of parent to child route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//REVIEWS
//POST REVIEW ROUTE..store in db too
router.post(
  "/", //{ mergeParams: true }--child route
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE REVIEW ROUTE
router.delete(
  "/:reviewId", //{ mergeParams: true }--child route
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router; //exporting router
