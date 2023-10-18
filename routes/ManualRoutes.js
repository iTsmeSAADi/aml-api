import express from "express";
import {
  docuPassSearchByCustomId,
  emailIdentityVerification,
  getAllInvitations,
  getSentInvitations,
  quickDocumentScan,
  quickNameSearch,
} from "../controllers/manualController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import screeningRoutes from "../routes/ScreeningRoutes.js";
const router = express.Router();
//email Identity Verification
router
  .route("/emailverificationidentity")
  .post(isAuthenticated, emailIdentityVerification);
//manual quick name search
router.route("/quicknamesearch").post(isAuthenticated, quickNameSearch);
//docupass search by custom id. i.e id from local database.
router
  .route("/emailverificationidentity/:docuPassCustomId")
  .get(isAuthenticated, docuPassSearchByCustomId);
//docupass all invitations status means all its values.
router.route("/getallinvitations").get(isAuthenticated, getAllInvitations);
//get all the sent invitations
router.route("/sentinvitations").get(isAuthenticated, getSentInvitations);
//quick document scan
router.route("/quickdocumentscan").post(isAuthenticated, quickDocumentScan);
//move to screening routes
router.use("/", isAuthenticated, screeningRoutes);
export default router;
