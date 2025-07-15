const express = require(`express`);
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListings } = require("../middlewares.js");
const controllersListing = require(`../controllers/listing.js`);
const multer = require("multer");
const { storage } = require(`../cloudConfig.js`);
const upload = multer({ storage });
//using  router.route
router
  .route("/")
  .get(wrapAsync(controllersListing.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListings,
    wrapAsync(controllersListing.createListing)
  );

//new route
router.get("/new", isLoggedIn, controllersListing.renderNewForm);
//filter
router.get("/filter/:q", wrapAsync(controllersListing.filterListings));
//search
router.get("/search", wrapAsync(controllersListing.search));
//:id router
router
  .route("/:id")
  .get(wrapAsync(controllersListing.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListings,
    wrapAsync(controllersListing.updateListings)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(controllersListing.deleteListing));
//listing route/ index route
// router.get("/", wrapAsync(controllersListing.index));

//show route
// router.get("/:id", wrapAsync(controllersListing.showListing));

//create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListings,
//   wrapAsync(controllersListing.createListing)
// );
//edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(controllersListing.editListing)
);
//update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListings,
//   wrapAsync(controllersListing.updateListings)
// );
//destroy route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(controllersListing.deleteListing)
// );
module.exports = router;
