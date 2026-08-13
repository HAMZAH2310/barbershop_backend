"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const barber_controller_1 = require("../controller/barber.controller");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const route = (0, express_1.Router)();
route.post("/register", upload_middleware_1.default.single("picture"), barber_controller_1.registerBarber);
route.get("/", barber_controller_1.getAllBarber);
exports.default = route;
