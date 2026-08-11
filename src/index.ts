import "dotenv/config";
import express from "express";
import cors from "cors";
import mainRoute from "./route/index"
import errorHandler from "./middleware/error.handling";


const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api", mainRoute)
app.use(errorHandler);

app.listen(PORT, () => (
    console.log(`Server is Running on ${PORT}`)
));