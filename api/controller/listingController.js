import Listing from "../models/listingModel.js";
import catchAsync from "../utils/catchAsync.js ";

export const createListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.create(req.body);
  return res.status(201).json(listing);
});
