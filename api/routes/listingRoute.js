import express from "express";

import { protect } from "../controller/userController.js";
import {
  createListing,
  deleteListings,
  getUserListings,
} from "../controller/listingController.js";

const router = express.Router();

router.post("/", protect, createListing);
router.get("/user/:id", protect, getUserListings);

router.route("/:id").delete(protect, deleteListings);
//   .get(protect, getListing)
//   .patch(protect, updateListing)

export default router;

// <button
// onClick={handleListingDelete(listing._id)}             className="text-red-700">Delete</button
// >
