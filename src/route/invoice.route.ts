import { Router } from "express";
import { getAllInvoice, getInvoiceById } from "../controller/invoice";

const route = Router();

route.get("/", getAllInvoice);
route.get("/:id", getInvoiceById);

export default route;
