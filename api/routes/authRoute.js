import express from "express";
import { google, login, logout, signup } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", google);
router.get("/logout", logout);

export default router;
