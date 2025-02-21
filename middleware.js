const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js"); //joi

module.exports.isLoggedIn = (req, res, next) => {
  //CONNECTING LODGIN ROUTE--how to check user is logged in?
  //console.log(req);//show all info inside req
  //console.log(req.path,"..", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //redirectURL--saved into req.session(variable)..as all middleware/methods have access of it
    req.flash("error", "you must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

// saves original url into locals so that access able everywhere and passport cant delete it
//one more middleware creates to save
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    //check listing owner is current user or not
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  //MIDDLEWARE/FUNCTION--PASS AS A PARAMETER (VALIDATION FOR SCHEMA)
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); //extract and map all details of error
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); //extract and map all details of error
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    //check listing owner is current user or not
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
