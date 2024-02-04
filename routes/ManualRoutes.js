import express from "express";
import multer from "multer";
import {
  docuPassSearchByCustomId,
  emailIdentityVerification,
  getAllInvitations,
  getSentInvitations,
  quickDocumentScan,
  quickNameSearch,
  forensicScanRequest,
  getSpecificScreeningReport
} from "../controllers/manualController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import screeningRoutes from "../routes/ScreeningRoutes.js";
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage()
});
//email Identity Verification
router.post("/emailverificationidentity", isAuthenticated, emailIdentityVerification);
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
router.route("/forensicScan").post(isAuthenticated, forensicScanRequest);
router.route("/screeningReport/:id").get(isAuthenticated, getSpecificScreeningReport)
//move to screening routes
router.use("/", isAuthenticated, screeningRoutes);
export default router;
