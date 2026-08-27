import "dotenv/config";
import express from "express";
import cors from "cors";
import mainRoute from "./route/index"
import errorHandler from "./middleware/error.handling";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// CORS harus dipasang di Express app agar semua HTTP request (termasuk PATCH/DELETE) punya header CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log(`Socket terhubung: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Socket terputus: ${socket.id}`);
    });
});

app.use("/api", mainRoute);
app.use(errorHandler);

// Gunakan httpServer.listen (bukan app.listen) agar Socket.IO aktif
httpServer.listen(PORT, '0.0.0.0', () =>
    console.log(`Server is Running on ${PORT}`)
);
