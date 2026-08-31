import { prisma } from "../../lib/prisma";
import { coreApi, snap } from "../lib/midtrans";
import { calculateMonthlyRevenue } from "../lib/revenue";
import { io } from "../index";
export const createTransaction = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "orderId harus diisi" });
        }
        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: {
                customer: true,
                orderItems: {
                    include: { service: true },
                }
            }
        });
        if (!order) {
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }
        if (order.orderItems.length === 0) {
            return res.status(400).json({ message: "Order belum punya item, tidak bisa dibuat transaksi" });
        }
        const grossAmount = order.orderItems.reduce((sum, item) => sum + item.subtotal, 0);
        const midtransOrderId = `ORDER-${order.id}-${Date.now()}`;
        const itemDetails = order.orderItems.map((item) => ({
            id: String(item.serviceId),
            price: item.price,
            quantity: item.qty,
            name: item.service.name,
        }));
        const parameter = {
            transaction_details: {
                order_id: midtransOrderId,
                gross_amount: grossAmount,
            },
            item_details: itemDetails,
            customer_details: {
                first_name: order.customer.name,
                email: order.customer.email,
                phone: String(order.customer.phone),
            },
        };
        const transaction = await snap.createTransaction(parameter);
        const savedTransaction = await prisma.midtransTransaction.create({
            data: {
                orderId: order.id,
                midtransOrderId,
                grossAmount,
                snapToken: transaction.token,
                redirectUrl: transaction.redirect_url,
                transactionStatus: "pending",
            }
        });
        await prisma.order.update({
            where: { id: Number(orderId) },
            data: { payement_status: "pending" },
        });
        return res.status(201).json({
            message: "Transaksi berhasil dibuat !",
            data: {
                snapToken: transaction.token,
                redirectUrl: transaction.redirect_url,
                midtransOrderId,
            }
        });
    }
    catch (err) {
        next(err);
    }
};
export const handleNotification = async (req, res, next) => {
    try {
        const notification = req.body;
        const statusResponse = await coreApi.transaction.notification(notification);
        const { order_id, transaction_status, fraud_status, payment_type, transaction_id, transaction_time, va_numbers, } = statusResponse;
        const midtransTransaction = await prisma.midtransTransaction.findUnique({
            where: { midtransOrderId: order_id },
        });
        if (!midtransTransaction) {
            console.warn(`Notifikasi diterima untuk order_id yang tidak dikenal: ${order_id}`);
            return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        }
        let newPaymentStatus = "pending";
        if (transaction_status === "capture") {
            newPaymentStatus = fraud_status === "accept" ? "paid" : "pending";
        }
        else if (transaction_status === "settlement") {
            newPaymentStatus = "paid";
        }
        else if (transaction_status === "deny") {
            newPaymentStatus = "failed";
        }
        else if (transaction_status === "cancel") {
            newPaymentStatus = "cancelled";
        }
        else if (transaction_status === "expire") {
            newPaymentStatus = "expired";
        }
        else if (transaction_status === "pending") {
            newPaymentStatus = "pending";
        }
        await prisma.midtransTransaction.update({
            where: { id: midtransTransaction.id },
            data: {
                transactionId: transaction_id,
                transactionStatus: transaction_status,
                fraudStatus: fraud_status,
                paymentType: payment_type,
                vaNumber: va_numbers?.[0]?.va_number,
                bank: va_numbers?.[0]?.bank,
                transactionTime: transaction_time ? new Date(transaction_time) : undefined,
                rawResponse: statusResponse,
            }
        });
        await prisma.order.update({
            where: { id: midtransTransaction.orderId },
            data: { payement_status: newPaymentStatus },
        });
        if (newPaymentStatus === "paid") {
            const existingInvoice = await prisma.invoice.findUnique({
                where: { orderId: midtransTransaction.orderId }
            });
            if (existingInvoice) {
                await prisma.invoice.create({
                    data: {
                        orderId: midtransTransaction.orderId,
                        invoiceNo: `INV-${midtransTransaction.orderId}-${Date.now()}`,
                        totalAmount: midtransTransaction.grossAmount,
                        paidAt: new Date(),
                        status: "paid",
                    }
                });
            }
            const revenue = await calculateMonthlyRevenue();
            io.emit("revenue:updated", revenue);
        }
        return res.status(200).json({
            message: "Notifikasi berhasil diproses"
        });
    }
    catch (err) {
    }
};
export const getMonthlyRevenu = async (req, res, next) => {
    try {
        const data = await calculateMonthlyRevenue();
        return res.status(200).json({ message: "Success", data });
    }
    catch (err) {
        next(err);
    }
};
