import express from "express";
import { getAllScreenings } from "../controllers/screeningController.js";
const router = express.Router();
//get all screenings
router.route("/getallscreenings").get(getAllScreenings);
export default router;
