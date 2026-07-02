import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logRoutes from "./Routes/logRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/logs", logRoutes);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Logging Middleware running on port ${PORT}`);
});