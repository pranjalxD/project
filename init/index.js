const mongoose = require(`mongoose`);
const { ObjectId } = mongoose.Types;
const initdata = require(`./data.js`);
const Listings = require(`../models/listings.js`);

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}
main()
  .then(() => {
    console.log(`connected to DB`);
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listings.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: new ObjectId("68657ad211ddf3122fdf54da"),
  }));
  await Listings.insertMany(initdata.data);
  console.log(`working`);
};

initDB();
