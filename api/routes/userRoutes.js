import express from "express";
import {
  protect,
  test,
  getUser,
  updateUser,
  deleteUser,
} from "../controller/userController.js";

const router = express.Router();

router.get("/test", test);
router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
