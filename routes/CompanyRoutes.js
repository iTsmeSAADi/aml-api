import express from "express";
import {
  addCompany,
  changePassword,
  getAllCompanies,
  getAllInvitedUsers,
  inviteUser,
  invitedUserLogOut,
  invitedUserLogin,
} from "../controllers/companyController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
const router = express.Router();
//get all companies by superAdmin
router.route("/").get(isAuthenticated, isSuperAdmin, getAllCompanies);
//add new company only by superAdmin
router.route("/addcompany").post(isAuthenticated, isSuperAdmin, addCompany);
//Invite User user management by superAdmin
router.route("/inviteuser").post(isAuthenticated, isSuperAdmin, inviteUser);
//login invited user( here isAuth is not for superAdmin).
router.route("/login").post(invitedUserLogin);
//change password of invited user
router.route("/changepassword").put(isAuthenticated, changePassword);
//logout invited user
router.route("/logout").get(invitedUserLogOut);
//get all invited users
router
  .route("/invitedusers")
  .get(isAuthenticated, isSuperAdmin, getAllInvitedUsers);
export default router;
