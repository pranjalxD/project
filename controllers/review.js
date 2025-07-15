const Listings = require(`../models/listings.js`);
const Review = require(`../models/review.js`);

//Review
//Post route
module.exports.reviewPost = async (req, res) => {
  const { id } = req.params;
  const listing = await Listings.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
  res.locals.success = req.flash("success", "Review added successfully");
  res.redirect(`/listings/${id}`);
};
//Review Delete route
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  res.locals.success = req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};
