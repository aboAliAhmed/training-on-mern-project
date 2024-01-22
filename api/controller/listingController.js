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
    return new AppError("You can only view your own listings!");
  }
});
