//INITIALIZE OWR DB

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
//..all function of db are async therefore await or .then
const initDB = async () => {
  // try {
  await Listing.deleteMany({}); //Delete already stored data
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67b5d4247c2b03fe8888905d",
  })); //OVER OBJECT CONVERT TO NEW OBJ with owner property
  await Listing.insertMany(initData.data); //insert data from data.js
  console.log("data was initialized");
  // } catch (err) {
  // console.log("Error inititallizing DB:", err);
  // }
};

initDB(); //calling
