import { Router } from "express";
import { createOrder, getAllOrders, getOrder, updateStatusOrder } from "../controller/orders.controller";

const route = Router();

route.post("/", createOrder);
route.get("/", getAllOrders);
route.get("/:id", getOrder);
route.patch("/:id/status", updateStatusOrder);

export default route;