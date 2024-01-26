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

export const getListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new AppError("Listing not found", 404));
  }

  res.status(200).json(listing);
});

export const updateListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(new AppError("Listing is not existed", 404));
  }

  if (req.user.id !== listing.userRef.toString()) {
    return next(new AppError("You can only update your own listing", 401));
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedListing);
});

export const deleteListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(new AppError("Listing not found", 404));
  }

  if (req.user.id !== listing.userRef.toString()) {
    return next(new AppError("You can only delete your own listing", 401));
  }

  await Listing.findByIdAndDelete(req.params.id);
  res.status(200).json("Listing has been deleted!");
});

export const getListings = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;
  let offer = req.query.offer;

  if (offer === undefined || offer === false) {
    offer = { $in: [false, true] };
  }

  let furnished = req.query.furnished;

  if (furnished === undefined || furnished === false) {
    furnished = { $in: [false, true] };
  }

  let parking = req.query.parking;

  if (parking === undefined || parking === false) {
    parking = { $in: [false, true] };
  }

  let type = req.query.type;

  if (type === undefined || type === "all") {
    type = { $in: ["sale", "rent"] };
  }

  const searchTerm = req.query.searchTerm || "";

  const sort = req.query.sort || "createdAt";

  const order = req.query.order || "desc";

  const listings = await Listing.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  return res.status(200).json(listings);
});
