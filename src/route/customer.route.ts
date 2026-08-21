import { Router } from "express";
import { registerCustomer, getAllCustomer, getCustomerDetails, updateCustomer, deleteCustomer } from "../controller/customer.controller";
import upload from "../middleware/upload.middleware";
import { isAdmin } from "../middleware/authorization.middleware";

const route = Router();

route.post("/", upload.single('profilePicture'), registerCustomer);
route.get("/", getAllCustomer);
route.get("/:id", getCustomerDetails);
route.patch("/:id", upload.single('profilePicture'), updateCustomer);
route.delete("/:id", isAdmin, deleteCustomer);

export default route;