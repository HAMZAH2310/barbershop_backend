"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controller/payment.controller");
const route = (0, express_1.Router)();
route.get("/", payment_controller_1.getPayment);
route.post("/", payment_controller_1.createPayment);
exports.default = route;
