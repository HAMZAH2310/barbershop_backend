import { Router } from "express";
import { createPayment, getPayment } from "../controller/payment.controller";

const route = Router();

route.get("/", getPayment);
route.post("/", createPayment);

export default route;