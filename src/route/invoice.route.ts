import { Router } from "express";
import { getAllInvoice, getInvoiceById } from "../controller/invoice";

const route = Router();

route.get("/:id", getInvoiceById);
route.get("/", getAllInvoice)

export default route;
