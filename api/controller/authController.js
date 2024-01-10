import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const hashpassword = bcryptjs.hashSync(req.body.password, 12);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashpassword,
  });
  await newUser.save();
  createSendToken(newUser, 201, res);
  next();
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Provide your email and password", 401));
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user)
      return next(new AppError("There is no user for this email", 401));
    if (!(await user.correctPassword(password, user.password)))
      return next(new AppError("wrong password", 401));
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
});
