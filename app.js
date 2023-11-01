import express from "express";
import { config } from "dotenv";
import multer from 'multer';
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
import userRouter from "./routes/UserRoutes.js";
import companyRoutes from "./routes/CompanyRoutes.js";
import manualRoutes from "./routes/ManualRoutes.js";
import screaningsRoute from "./routes/ScreeningRoutes.js";
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyAccqqSrkBYn5Qy-0QSevp0IzGte2u-JOg",
  authDomain: "horselux-167fb.firebaseapp.com",
  projectId: "horselux-167fb",
  storageBucket: "horselux-167fb.appspot.com",
  messagingSenderId: "671280788159",
  appId: "1:671280788159:web:2f50716c1a52a94bdc8c0a",
  measurementId: "G-PZ1B67EE2D"
};

import cors from "cors";

import {
  connectIDAnalyzer,
  connectIDAnalyzerCoreAPI,
  connectIDAnalyzerDocuPass,
  connectIDAnalyzerVault,
} from "./utils/connectIDAnalyzer.js";
config({
  path: "./.env",
});
const app = express();

initializeApp(firebaseConfig);
const fbStorage = getStorage();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
//cors configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
//idAnalyzer connections.
export const amlAPI = connectIDAnalyzer();
export const DocuPass = connectIDAnalyzerDocuPass();
export const VaultApi = connectIDAnalyzerVault();
export const CoreAPI = connectIDAnalyzerCoreAPI();



const upload = multer({
  storage: multer.memoryStorage()
});

// Define a route to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const storageRef = ref(fbStorage, 'images/' + file.originalname);

  try {
    await uploadBytes(storageRef, file.buffer);
    const downloadURL = await getDownloadURL(storageRef);
    res.json({ downloadURL });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/", (req, res) => {
  res.status(200).send("Backend is working...");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/manual", manualRoutes);
app.use("/api/v1/getallscreenings", screaningsRoute);

export default app;
app.use(errorMiddleware);
