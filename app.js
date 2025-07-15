if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require(`express`);
const app = express();
const mongoose = require(`mongoose`);
const Listings = require(`./models/listings.js`);
const path = require(`path`);
// const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require(`method-override`);
const ejsMate = require(`ejs-mate`);
// const { listingSchema, reviewSchema } = require(`./Schema.js`);
// const Review = require(`./models/review.js`);
const listingsRouter = require(`./routes/listing.js`);
const reviewsRouter = require(`./routes/review.js`);
const userRouter = require(`./routes/user.js`);
const session = require(`express-session`);
const MongoStore = require("connect-mongo");
const flash = require(`connect-flash`);
const Passport = require(`passport`);
const LocalStrategy = require(`passport-local`);
const User = require(`./models/user.js`);
const dbURL = process.env.ATLASMONGO_URL;

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error occured in Mongo Atlas.", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(express.static("public"));
app.use(session(sessionOptions));
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(Passport.initialize());
app.use(Passport.session());

Passport.use(new LocalStrategy(User.authenticate()));
Passport.serializeUser(User.serializeUser());
Passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

async function main() {
  await mongoose.connect(dbURL);
}
main()
  .then(() => {
    console.log(`connected to DB`);
  })
  .catch((err) => {
    console.log(err);
  });

// const fakeUser = new User({
//   email: "fakeUser@gmail.com",
//   username: "faekUser", //username not in model but it is initialized by passport by default.
// });

// app.get("/demoUser", async (req, res) => {
//   let registeredUser = await User.register(fakeUser, "@fakeUser"); //(userdetails,password)
//   res.send(registeredUser);
// });

//home route
app.get("/", (req, res) => {
  res.render(`listings/home.ejs`);
});

app.get("/listingtest", async (req, res) => {
  let sampleListings = new Listings({
    title: "My New Villa",
    description: "By the beach",
    location: "Calangute,Goa",
    country: "Goa",
    price: 6700,
  });
  await sampleListings.save();
  res.send(`workingggggg`);
  console.log(`saved`);
});
//routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });
app.use((err, req, res, next) => {
  const { status = 404, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log(`app is listening on port 8080`);
});
