import { Router } from "express";
import customerRoute from "./customer.route";
import barberRoute from "./barber.route";
import services from "./services.route";
import orderRoute from "./order.route";
import authRoute from "./auht.route";
import { authentication } from "../middleware/auth.middleware";
import orderItemRoute from "./orderItem.route";
import paymentRoute from "./payment.route";
import invoiceRoute from "./invoice.route";


const app = Router();

app.use("/auth", authRoute);
app.use(authentication)

app.use("/customer", customerRoute);
app.use("/barber", barberRoute);
app.use("/services", services);
app.use("/orders", orderRoute);
app.use("/order-items", orderItemRoute);
app.use("/payment", paymentRoute);
app.use("/invoice", invoiceRoute)

export default app;