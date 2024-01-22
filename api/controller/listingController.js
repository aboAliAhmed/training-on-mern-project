import Listing from "../models/listingModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js ";

export const createListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.create(req.body);
  return res.status(201).json(listing);
});

export const getUserListings = catchAsync(async (req, res, next) => {
  if (req.user.id === req.params.id) {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } else {
    return next(new AppError("You can only view your own listings!"));
  }
});

export const getListings = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new AppError("Listing not found", 404));
  }

  if (req.user.id !== listing.userRef.toString()) {
    return next(new AppError("You can only delete your own listing", 401));
  }

  res.status(200).json(listing);
});

export const updateListings = catchAsync(async (req, res, next) => {});

export const deleteListings = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  console.log(!listing);
  if (!listing) {
    console.log("lel");
    return next(new AppError("Listing not found", 404));
  }
  console.log(req.user.id !== listing.userRef.toString());

  if (req.user.id !== listing.userRef.toString()) {
    return next(new AppError("You can only delete your own listing", 401));
  }

  await Listing.findByIdAndDelete(req.params.id);
  res.status(200).json("Listing has been deleted!");
});
