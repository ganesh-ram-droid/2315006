import express from "express";
import { SendLog } from "../Controller/logController.js";


const router = express.Router();

router.post("/", SendLog);

export default router;
