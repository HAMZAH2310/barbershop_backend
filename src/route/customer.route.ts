import { Router } from "express";
import { registerCustomer, getAllCustomer, getCustomerDetails, updateCustomer, deleteCustomer } from "../controller/customer.controller";
import upload from "../middleware/upload.middleware";

const route = Router();

route.post("/register", upload.single('profilePicture'), registerCustomer);
route.get("/", getAllCustomer);
route.get("/:id", getCustomerDetails);
route.patch("/:id", updateCustomer);
route.delete("/:id", deleteCustomer);

export default route;