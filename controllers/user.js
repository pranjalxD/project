const User = require(`../models/user.js`);
//signup get
module.exports.signUpFormRender = (req, res) => {
  res.render(`users/signup.ejs`);
};
//signup post
module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    //   console.log(req.user);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Holiday.");
      let redirectURL = res.locals.redirectURL || `/listings`;
      delete req.session.redirectURL;
      res.redirect(redirectURL);
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};
//login get
module.exports.loginFormRender = (req, res) => {
  res.render(`users/login.ejs`);
};
//login post
module.exports.login = async (req, res) => {
  // console.log(req.user);
  req.flash(`success`, `Welcome Back!`);
  let redirectURL = res.locals.redirectURL || `/listings`;
  delete req.session.redirectURL;
  res.redirect(redirectURL);
};
//logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are successfully logged out");
    res.redirect("/listings");
  });
};
