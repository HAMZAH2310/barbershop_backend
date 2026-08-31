import { Router } from "express";
import { createOrder, getAllOrders, getOrder, updateStatusOrder, getQueuePosition, cancelOrder } from "../controller/orders.controller";
import { authentication } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/authorization.middleware";

const route = Router();

route.post("/", authentication, createOrder);
route.get("/", authentication, getAllOrders);
route.get("/:id", authentication, getOrder);
route.patch("/:id/cancel", authentication, isAdmin, cancelOrder);
route.get("/:id/queue", authentication, getQueuePosition);
route.patch("/:id/status", authentication, isAdmin, updateStatusOrder);

export default route;