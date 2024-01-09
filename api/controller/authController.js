import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import bcryptjs from "bcrypt";

export const signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const hashpassword = bcryptjs.hashSync(req.body.password, 12);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashpassword,
  });
  await newUser.save();

  res.status(201).json({
    status: "successful",
    data: {
      user: newUser,
    },
  });
  next();
});
