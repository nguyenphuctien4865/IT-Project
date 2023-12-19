import express from "express";
import { createReview, updateReview, deleteReview, selectAllReviewByProductId } from "../controllers/reviewController.js"
const router = express.Router();


// create a new review
router.post("/", createReview);

// update a review by review id
router.patch("/:id", updateReview);

// delete a review by review id
router.delete("/:id", deleteReview);

// select all review by product id
router.get("/:id", selectAllReviewByProductId);

export default router;
