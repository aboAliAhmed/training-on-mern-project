import express from "express";
import { protect, test, updateUser } from "../controller/userController.js";

const router = express.Router();

router.get("/test", test);
router.post("/updateMe/:id", protect, updateUser);

export default router;
