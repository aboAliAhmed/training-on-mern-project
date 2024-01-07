import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
const app = express();
app.use(express.json());

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.use("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1/user", userRoutes);
