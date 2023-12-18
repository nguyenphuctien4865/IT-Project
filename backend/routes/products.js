import express from "express";
import { updateProduct, deleteProduct, selectProductsByCategory, selectAllProducts, createProduct, selectProduct, selectAllProductsAndSort, selectProductsByCategoryAndSort, selectAllProductsAndSortDate, selectProductsByCategoryAndSortDate, isExistedName } from "../controllers/productController.js";
import { verifyBuyer, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// select all products
router.get("/", selectAllProducts);

// select product by id
router.get("/:id", selectProduct);

// select product by name
router.get("/check/:name", isExistedName);

router.get("/sort/date/:code", selectAllProductsAndSortDate);

// select all products ex: code = desc => descending, code = asc => ascending
router.get("/sort/:code", selectAllProductsAndSort);

router.get("/category/sort/:id/date/:code", selectProductsByCategoryAndSortDate);

// select a product by category id and sort price
router.get("/category/sort/:id/:code", selectProductsByCategoryAndSort);

// select a product by category id default
router.get("/category/:id", selectProductsByCategory);



// create a new product
router.post("/", createProduct);

// delete a product
router.delete("/:id", deleteProduct);

// update a product
router.put("/:id", updateProduct);



export default router;