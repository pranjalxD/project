const express = require(`express`);
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Passport = require("passport");
const { saveRedirectURL } = require("../middlewares.js");
const controllersUser = require(`../controllers/user.js`);
// router.use(express.urlencoded({ extended: true }));

router
  .route("/signup")
  .get(controllersUser.signUpFormRender)
  .post(saveRedirectURL, wrapAsync(controllersUser.signUp));

router
  .route("/login")
  .get(controllersUser.loginFormRender)
  .post(
    saveRedirectURL,
    Passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    controllersUser.login
  );
//signup form
// router.get("/signup", controllersUser.signUpFormRender);
//signup
// router.post("/signup", saveRedirectURL, wrapAsync(controllersUser.signUp));
//login from render
// router.get("/login", controllersUser.loginFormRender);
//login
// router.post(
//   "/login",
//   saveRedirectURL,
//   Passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   controllersUser.login
// );
//logout
router.get("/logout", controllersUser.logout);
module.exports = router;
