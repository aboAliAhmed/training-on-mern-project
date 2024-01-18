import express from "express";

import { protect } from "../controller/userController.js";
import { createListing } from "../controller/listingController.js";

const router = express.Router();

router.post("/", protect, createListing);

export default router;
