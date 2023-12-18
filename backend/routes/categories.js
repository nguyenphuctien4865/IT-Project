import express from "express";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  selectAllCategories,
  selectCategory,
} from "../controllers/categoryController.js";

import { verifyBuyer, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// select all categories
router.get("/", selectAllCategories);
// select all categories
router.get("/:id", selectCategory);

// create category
router.post("/", createCategory);

// delete category
router.delete("/:id", deleteCategory);

// update name category
router.patch("/:id", updateCategory);

export default router;
