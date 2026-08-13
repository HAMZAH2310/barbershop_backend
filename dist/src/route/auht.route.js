"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const route = (0, express_1.Router)();
route.post("/register", auth_controller_1.register);
route.post("/login", auth_controller_1.login);
exports.default = route;
