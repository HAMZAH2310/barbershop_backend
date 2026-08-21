import { Router } from "express";
import { CreateServices, getAllServices, updateService, deletedService } from "../controller/service.controller";
import upload from "../middleware/upload.middleware";
import { isAdmin } from "../middleware/authorization.middleware";

const route = Router();

route.get("/", getAllServices);
route.post("/", upload.single("image"), CreateServices);
route.patch("/:id", isAdmin, upload.single("image"), updateService);
route.delete("/:id", isAdmin, deletedService);

export default route;