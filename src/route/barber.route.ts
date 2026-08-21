import { Router } from "express";
import { registerBarber, getAllBarber } from "../controller/barber.controller";
import upload from "../middleware/upload.middleware";

const route = Router();

route.post("/", upload.single("picture"), registerBarber);
route.get("/", getAllBarber);

export default route