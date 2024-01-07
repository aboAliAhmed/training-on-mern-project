import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("The connection to database is successful");
  })
  .catch((err) => console.log(err));

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
