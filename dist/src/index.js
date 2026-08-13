"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./route/index"));
const error_handling_1 = __importDefault(require("./middleware/error.handling"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
app.use("/api", index_1.default);
app.use(error_handling_1.default);
app.listen(PORT, () => (console.log(`Server is Running on ${PORT}`)));
