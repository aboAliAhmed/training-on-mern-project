import express from "express";

import { protect } from "../controller/userController.js";
import {
  getListings,
  createListing,
  deleteListing,
  getListing,
  getUserListings,
  updateListing,
} from "../controller/listingController.js";

const router = express.Router();

router.get("/user/:id", protect, getUserListings);

router.route("/").get(getListings).post(protect, createListing);

router
  .route("/:id")
  .get(getListing)
  .patch(protect, updateListing)
  .delete(protect, deleteListing);

export default router;
