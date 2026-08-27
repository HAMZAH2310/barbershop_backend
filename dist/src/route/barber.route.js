import { Router } from "express";
import { registerBarber, getAllBarber, updateStatusBarber } from "../controller/barber.controller";
import upload from "../middleware/upload.middleware";
import { isAdmin } from "../middleware/authorization.middleware";
const route = Router();
route.post("/", isAdmin, upload.single("picture"), registerBarber);
route.get("/", getAllBarber);
route.patch("/:id/status", isAdmin, updateStatusBarber);
export default route;
