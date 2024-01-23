import express from "express";

import { protect } from "../controller/userController.js";
import {
  createListing,
  deleteListing,
  getListing,
  getUserListings,
  updateListing,
} from "../controller/listingController.js";

const router = express.Router();

router.post("/", protect, createListing);
router.get("/user/:id", protect, getUserListings);

router
  .route("/:id")
  .get(getListing)
  .patch(protect, updateListing)
  .delete(protect, deleteListing);

export default router;
