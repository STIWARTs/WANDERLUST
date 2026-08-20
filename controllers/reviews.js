const Listing = require("../models/listing");
const Review = require("../models/review");

//For Post Route
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; //author obj id with all new review
  // console.log(newReview);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  // console.log("new review saved");
  // res.send("new review saved");

  req.flash("success", "New Review Created!"); //flash req
  res.redirect(`/listings/${listing._id}`); //note using here " " doesnt works only `backtick works
};

//For Delete Route
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    //listing k review array(contain id of review) me se bhi delete krna padega
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull To reviews k ander k id(called as reviewId) ko
    await Review.findByIdAndDelete(reviewId); //review delete
    req.flash("success", "Review Deleted"); //flash req
    res.redirect(`/listings/${id}`); //redirect to the same page
  }