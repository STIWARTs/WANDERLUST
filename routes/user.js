const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

//SIGNUP USER //POST--ASYNC as db me changes krarahe
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

//LOGIN USER //IMPLEMENT--ASYNC as db me changes krarahe
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      //middleware for authentication-- form exit on db or not
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//LOG OUT USER
router.get("/logout", userController.logout);

module.exports = router;
