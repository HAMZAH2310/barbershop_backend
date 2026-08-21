import "dotenv/config";
import express from "express";
import cors from "cors";
import mainRoute from "./route/index"
import errorHandler from "./middleware/error.handling";


const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api", mainRoute)
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => (
    console.log(`Server is Running on ${PORT}`)
));