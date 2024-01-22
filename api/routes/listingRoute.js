import express from "express";

import { protect } from "../controller/userController.js";
import {
  createListing,
  getUserListings,
} from "../controller/listingController.js";

const router = express.Router();

router.post("/", protect, createListing);
router.get("/:id", protect, getUserListings);

export default router;
