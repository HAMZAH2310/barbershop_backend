import { prisma } from "../../lib/prisma";
import { io } from "../index";
export async function syncTransactionStatus(statusResponse) {
    const { order_id, transaction_status, fraud_status, payment_type, transaction_id, transaction_time, va_numbers, } = statusResponse;
    const midtransTransaction = await prisma.midtransTransaction.findUnique({
        where: { midtransOrderId: order_id }
    });
    if (!midtransTransaction) {
        return { found: false };
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
    const updatedOrder = await prisma.order.update({
        where: { id: midtransTransaction.orderId },
        data: { payement_status: newPaymentStatus }
    });
    io.emit("order:statusUpdated", updatedOrder);
    if (newPaymentStatus === "paid") {
        const existingInvoice = await prisma.invoice.findUnique({
            where: { orderId: midtransTransaction.orderId }
        });
        if (!existingInvoice) {
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
        const { calculateMonthlyRevenue } = await import("./revenue");
        const revenue = await calculateMonthlyRevenue();
        io.emit("revenue:updated", revenue);
    }
    return { found: true, status: newPaymentStatus };
}
