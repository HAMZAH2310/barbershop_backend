import { Router } from "express";
import { createTransaction, handleNotification } from "../controller/midtrans.controller";
const route = Router();
route.post("/create-transaction", createTransaction);
route.post("/notification", handleNotification);
export default route;
