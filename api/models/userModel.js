import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "please provide your name"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "please provide your name"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide your name"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
