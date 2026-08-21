import "dotenv/config";
import express from "express";
import cors from "cors";
import mainRoute from "./route/index"
import errorHandler from "./middleware/error.handling";
import cookieParser from "cookie-parser";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", mainRoute)
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => (
    console.log(`Server is Running on ${PORT}`)
));