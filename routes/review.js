const express = require(`express`);
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require(`../Schema.js`);
const { isLoggedIn } = require("../middlewares.js");
const controllersReview = require(`../controllers/review.js`);

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

//Review
//Post route
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(controllersReview.reviewPost)
);
//Review Delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(controllersReview.deleteReview)
);
module.exports = router;
