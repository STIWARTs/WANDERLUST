if (process.env.NODE_ENV != "production") {
  //condition--when production/deployment phase that time usnig node env
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js"); //Resturcturing route
const reviewRouter = require("./routes/review.js"); //Resturcturing route
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js"); //Resturcturing route--SIGNUP
// const cookieParser = require("cookie-parser");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //DB CONNECTING
const dbUrl = process.env.ATLASDB_URL;

//for call main function
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Define Session Options
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  //manupulate cookies
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7days millisecond
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //bydefault
  },
};

//RESTFUL APIs
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

//To use session Middleware
app.use(session(sessionOptions));
//To use flash Middleware
app.use(flash());

//PASPORT MIDDLEWARE --it uses session middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //use static authenticate method of model in LocalStrategy
//use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware--access flash success created on listing.js
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); //store on store message of succes in req.locals.succss
  res.locals.error = req.flash("error");
  //local define jo ki req.user k info ko store krega
  res.locals.currUser = req.user;
  next();
});

//DEMO USER
app.get("/demouser", async (req, res) => {
  //create fake user
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student", //can add as bydefault added by passportlocalmongoose in schema
  });

  //Storing/Send fake user to db,, using register method we set given password(stored db in hashed form) to the fake user & it automatically checks if username is unique
  let registeredUser = await User.register(fakeUser, "HelloWorld"); //pass user and password and can define callback
  res.send(registeredUser);
});

//Resturcturing route
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); //parent route
app.use("/", userRouter);

// STANDARD RESPONSE...For random route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

//SERVER SIDE ERROR VALIDATIONS
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err; //assigning default values
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

//START SERVER
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

// //basic route
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   //save in db
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
