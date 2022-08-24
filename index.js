import express from 'express';
import {moiverouter} from"./routes/moiverouter.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT=process.env.PORT || 5000;
const MONGO_URL=process.env.MONGO_URL;

mongoose.connect(MONGO_URL,console.log("Database connection established"));

app.use("/",moiverouter)

app.listen(PORT,console.log("server started",PORT));