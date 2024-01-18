import express from "express";
import {
  deleteUser,
  protect,
  test,
  updateUser,
} from "../controller/userController.js";

const router = express.Router();

router.get("/test", test);
router.route("/:id").patch(protect, updateUser).delete(protect, deleteUser);

export default router;
