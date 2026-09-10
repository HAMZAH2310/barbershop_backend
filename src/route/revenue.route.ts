import { Router } from "express";
import { authentication } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/authorization.middleware";
import { getRevenueRecap } from "../controller/revenue.controller";

const route = Router();

route.get("/recap", authentication, isAdmin, getRevenueRecap);

export default route;
