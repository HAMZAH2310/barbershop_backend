import { Router } from "express";
import { login, logout, register, resendVerificationEmail, verifyEmail } from "../controller/auth.controller";

const route = Router();

route.post("/register", register);
route.post("/login", login);
route.post("/logout", logout);
route.get("/verify-email", verifyEmail);
route.post("/resend-verification", resendVerificationEmail)


export default route;