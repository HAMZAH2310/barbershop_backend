"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_1 = require("../controller/invoice");
const route = (0, express_1.Router)();
route.get("/:id", invoice_1.getInvoiceById);
route.get("/", invoice_1.getAllInvoice);
exports.default = route;
