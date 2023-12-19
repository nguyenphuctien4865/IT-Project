import express from "express";
import {
  selectAllUsers,
  selectUser,
  deleteUser,
  updateUserPassword,
  updateUser,
  selectUserByEmail,
} from "../controllers/userController.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// select all users
router.get("/", selectAllUsers);

// select user
router.get("/:id", selectUser);

// select user bt email
router.get("/email/:email", selectUserByEmail);

// update user
router.put("/:id", updateUser);


// update user password
router.patch("/:email", updateUserPassword);

router.delete("/:id", deleteUser);
export default router;
