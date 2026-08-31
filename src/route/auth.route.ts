import { Router } from "express";
import { getProfile, login, logout, register, resendVerificationEmail, verifyEmail } from "../controller/auth.controller";
import { authentication } from "../middleware/auth.middleware";

const route = Router();

route.post("/register", register);
route.post("/login", login);
route.post("/logout", logout);
route.get("/verify-email", verifyEmail);
route.post("/resend-verification", resendVerificationEmail)
route.get("/me", authentication, getProfile)

export default route;