import express from "express";
import { register, login, sendCodeVerify } from "../controllers/authController.js";
const router = express.Router();

// send code to user's email address
router.post("/code", sendCodeVerify);

// register a new user
router.post("/register", register);

// login by email & password
router.post("/login", login);

export default router;

