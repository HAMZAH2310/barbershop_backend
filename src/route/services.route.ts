import { Router } from "express";
import { CreateServices, getAllServices, updateService, deletedService } from "../controller/service.controller";

const route = Router();

route.get("/", getAllServices);
route.post("/", CreateServices);
route.patch("/:id", updateService);
route.delete("/:id", deletedService);

export default route;