import { Router } from "express";
import { authentication } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/authorization.middleware";
import { createTransaction, handleNotification, getMonthlyRevenu } from "../controller/midtrans.controller";
const route = Router();
route.post("/create-transaction", createTransaction);
route.post("/notification", handleNotification);
route.get("/revenue/monthly", authentication, isAdmin, getMonthlyRevenu);
export default route;
