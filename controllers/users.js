const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body; //extract
    const newUser = new User({ username, email }); //create new user
    const registeredUser = await User.register(newUser, password); // register new user to db
    console.log(registeredUser); //print

    // req.login method call--login after signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!"); //flash mesage
      res.redirect("/listings"); //redirecting to home page
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl); //redirectURL
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    //takes callback as a parameter
    if (err) {
      //if error occurs while login
      return next(err);
    }
    //when no error
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};
