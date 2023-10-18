import express from "express";
const router = express.Router();
import {
  changePassword,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
//Resister User
router.route("/register").post(register);
//Login User
router.route("/login").post(login);
//Change Password
router.route("/changepassword").put(isAuthenticated, changePassword); //isAuthentication is middleware.
//Logout User
router.route("/logout").get(logout);

export default router;
