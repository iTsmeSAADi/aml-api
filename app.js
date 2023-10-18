import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
import userRouter from "./routes/UserRoutes.js";
import companyRoutes from "./routes/CompanyRoutes.js";
import manualRoutes from "./routes/ManualRoutes.js";
import cors from "cors";
import {
  connectIDAnalyzer,
  connectIDAnalyzerCoreAPI,
  connectIDAnalyzerDocuPass,
  connectIDAnalyzerVault,
} from "./utils/connectIDAnalyzer.js";
config({
  path: "./config/config.env",
});
const app = express();
//using middlewares
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
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
//idAnalyzer connections.
export const amlAPI = connectIDAnalyzer();
export const DocuPass = connectIDAnalyzerDocuPass();
export const VaultApi = connectIDAnalyzerVault();
export const CoreAPI = connectIDAnalyzerCoreAPI();

//importing and using Routes
app.get("/", (req, res) => {
  res.status(200).send("Backend is working...");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/manual", manualRoutes);

export default app;
app.use(errorMiddleware);
