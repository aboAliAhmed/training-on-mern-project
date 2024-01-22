import express from "express";

import { protect } from "../controller/userController.js";
import {
  createListing,
  deleteListing,
  getListings,
  getUserListings,
  updateListing,
} from "../controller/listingController.js";

const router = express.Router();

router.post("/", protect, createListing);
router.get("/user/:id", protect, getUserListings);

router
  .route("/:id")
  .delete(protect, deleteListing)
  .patch(protect, updateListing)
  .get(protect, getListings);

export default router;
