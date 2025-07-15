const Listing = require(`./models/listings`);
const { listingSchema, reviewSchema } = require(`./Schema.js`);
const ExpressError = require("./utils/ExpressError.js");
const Review = require(`./models/review.js`);

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("error", "You must be logged in to access or create listings!");
    return res.redirect("/signup");
  }
  next();
};
module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};
//when we click on add new listing without login, the signup page appears
//after signup we are redirected to listings page but we wanted to go to create
//to solve that we use a method of req object called originalURL which finds the original url
//then we store it in locals variable to transfer it to other files
module.exports.isOwner = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (
      !res.locals.currUser ||
      !listing.owner.equals(res.locals.currUser._id)
    ) {
      req.flash("error", "You are not the owner of this listing.");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (error) {
    const errorMessage = "Page not exists anymore";
    const err = new ExpressError(400, errorMessage);
    next(err);
  }
};
module.exports.validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (
      !res.locals.currUser ||
      !review.author.equals(res.locals.currUser._id)
    ) {
      req.flash("error", "You are not the author of this review.");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (error) {
    const errorMessage = "Page not exists anymore";
    const err = new ExpressError(400, errorMessage);
    next(err);
  }
};
