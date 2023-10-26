import express from "express";
const router = express.Router();

import {
  changePassword,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/changepassword").put(isAuthenticated, changePassword);
router.route("/logout").get(logout);
export default router;
