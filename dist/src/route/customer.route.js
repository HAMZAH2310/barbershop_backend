"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controller/customer.controller");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const route = (0, express_1.Router)();
route.post("/register", upload_middleware_1.default.single('profilePicture'), customer_controller_1.registerCustomer);
route.get("/", customer_controller_1.getAllCustomer);
route.get("/:id", upload_middleware_1.default.single('profilePicture'), customer_controller_1.getCustomerDetails);
route.patch("/:id", customer_controller_1.updateCustomer);
route.delete("/:id", customer_controller_1.deleteCustomer);
exports.default = route;
