import express from "express";
import { searchProductAndSortDate, searchProductAndSortPrice, searchProduct } from "../controllers/searchController.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();


router.get("/:text", searchProduct);

router.get("/:text/sort/date/:code", searchProductAndSortDate);

router.get("/:text/sort/:code", searchProductAndSortPrice);


export default router;
