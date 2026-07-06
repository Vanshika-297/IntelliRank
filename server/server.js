import express from "express";
import cors from "cors";
import "dotenv/config"
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import rankRouter from "./routes/rankRoute.js";
import analysisRouter from "./routes/analysisRoutes.js";
import { startrankTrackingCron } from "./cron/rankTrackingCron.js";

connectDB();

const app=express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>res.send("Server is running"))
app.use("/api/auth",authRouter);
app.use("/api/rank",rankRouter);
app.use("/api/analysis",analysisRouter)

//Start cron jobs
startrankTrackingCron()

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started at PORT ${PORT}`))