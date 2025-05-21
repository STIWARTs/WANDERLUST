const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
//For Index Route
module.exports.index = async (req, res) => {
  //index is an async fuction which renders all contained files
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//For New Route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//For Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //as id pass horahi hai but we want whole data of that id then we use populate method
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

//For Create Route
module.exports.createListing = async (req, res, next) => {
  //let (title, description, image, price, country, location) = req.body;//extract
  //another way to make variable of new.ejs to object ki key
  // let result = listingSchema.validate(req.body);//joi
  // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }

  ///geocoding
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "..", filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //owner new with new listing
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!"); //flash req
  res.redirect("/listings");
};

//For Edit Route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//For Update Route
module.exports.updateListing = async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!"); //flash req
  res.redirect(`/listings/${id}`); //redirect to show route
};

//For Delete Route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!"); //flash req
  res.redirect("/listings");
};
