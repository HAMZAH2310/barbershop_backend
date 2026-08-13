import { Router } from "express";
import { createItemOrder, deleteOrderItem, getOrderItems, updateItemOrder, getAllOrderItems } from "../controller/orderItem.contoller";

const route = Router();

route.post("/", createItemOrder);
route.get("/:id", getOrderItems);
route.get("/", getAllOrderItems)
route.patch("/:id", updateItemOrder);
route.delete("/:id", deleteOrderItem);

export default route;