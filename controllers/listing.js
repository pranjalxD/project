const Listings = require(`../models/listings.js`);
const ExpressError = require("../utils/ExpressError.js");

//listing route/ index route
module.exports.index = async (req, res) => {
  const allListings = await Listings.find({});
  res.render("listings/index.ejs", { allListings });
};
//new route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};
//show route
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listings = await Listings.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) //nested populate syntax
    .populate("owner");
  if (!listings) {
    req.flash("error", "the listing you trying to reach does not exist");
    return res.redirect("/listings");
  }
  console.log(listings);
  res.render("listings/show", { listings });
};
//create route
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  if (!req.body.listing) {
    throw new ExpressError(400, "Add valid data in listings");
  }

  const newListing = new Listings(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();

  req.flash("success", "New Listing created");
  res.redirect(`/listings/${newListing._id}`);
};
//edit Route
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listings = await Listings.findById(id);
  if (!listings) {
    req.flash("error", "the listing you trying to reach does not exist");
    return res.redirect("/listings");
  }
  // if (
  //   !listings.owner ||
  //   listings.owner.toString() !== req.user._id.toString()
  // ) {
  //   req.flash("error", "Access Denied");
  //   return res.redirect(`/listings/${id}`);
  // }
  let originalImage = listings.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listings, originalImage });
};
//update route
module.exports.updateListings = async (req, res) => {
  const { id } = req.params;
  await Listings.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing edited successfully");
  res.redirect(`/listings/${id}`);
};
//destroy route
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listings.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};
//filter
module.exports.filterListings = async (req, res, next) => {
  const { q } = req.params;
  const filteredListings = await Listings.find({ category: q }).exec();
  if (!filteredListings.length) {
    req.flash("error", "No Listings exists for this filter!");
    res.redirect("/listings");
    return;
  }
  res.locals.success = `Listings Filtered by ${q}`;
  res.render("listings/index.ejs", { allListings: filteredListings });
};
//search logic
module.exports.search = async (req, res) => {
  console.log(req.query.q);
  let input = req.query.q.trim().replace(/\s+/g, " "); //remove start and end space
  console.log(input);
  if (input == "" || input == " ") {
    //search value is empty
    req.flash("error", "Search value empty!!!");
    res.redirect("/listings");
  }

  //convert every word first letter capital and other small
  let data = input.split("");
  let element = "";
  let flag = false;
  for (let index = 0; index < data.length; index++) {
    if (index == 0 || flag) {
      element = element + data[index].toUpperCase();
    } else {
      element = element + data[index].toLowerCase();
    }
    flag = data[index] == " ";
  }
  console.log(element);

  let allListings = await Listings.find({
    title: { $regex: element, $options: "i" },
  });
  if (allListings.length != 0) {
    res.locals.success = "Listings searched by title";
    res.render("listings/index.ejs", { allListings });
    return;
  }
  if (allListings.length == 0) {
    allListings = await Listings.find({
      category: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by category";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    allListings = await Listings.find({
      country: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by country";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    allListings = await Listings.find({
      location: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by location";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }

  const intValue = parseInt(element, 10); //10 for decimal return - int ya NaN
  const intDec = Number.isInteger(intValue); //check intValue is number or not

  if (allListings.length == 0 && intDec) {
    allListings = await Listings.find({ price: { $lte: element } }).sort({
      price: 1,
    });
    if (allListings.length != 0) {
      res.locals.success = `Listings searched for less than Rs ${element}`;
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    req.flash("error", "Listings is not here !!!");
    res.redirect("/listings");
  }
};
