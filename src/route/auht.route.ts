import { Router } from "express";
import { login, logout, register } from "../controller/auth.controller";

const route = Router();

route.post("/register", register);
route.post("/login", login);
route.post("/logout", logout);

export default route;