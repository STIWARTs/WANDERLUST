const express = require("express");
const router = express.Router(); //creating new route object
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

//Index Route & //Create Route combined
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    
    upload.single("listing[image]"),//multer process listing
    validateListing,
    wrapAsync(listingController.createListing)//create listing callback
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route & Update Route combined
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
