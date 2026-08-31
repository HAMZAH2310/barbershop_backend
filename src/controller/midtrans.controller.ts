import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { coreApi, snap } from "../lib/midtrans";
import { calculateMonthlyRevenue } from "../lib/revenue";
import { io } from "../index";
import { syncTransactionStatus } from "../lib/midtransSync";

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "orderId harus diisi" });
        }

        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: {
                customer: true,
                orderItems: { include: { service: true } },
                midtransTransaction: {
                    where: { transactionStatus: "pending" },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                }
            }
        });

        if (!order) {
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }

        const existingPending = order.midtransTransaction[0];
        if (existingPending?.snapToken) {
            return res.status(200).json({
                message: "Melanjutkan transaksi yang belum selesai",
                data: {
                    snapToken: existingPending.snapToken,
                    redirectUrl: existingPending.redirectUrl,
                    midtransOrderId: existingPending.midtransOrderId,
                }
            });
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
            transaction_details: { order_id: midtransOrderId, gross_amount: grossAmount },
            item_details: itemDetails,
            customer_details: {
                first_name: order.customer.name,
                email: order.customer.email,
                phone: String(order.customer.phone),
            },
        };

        const transaction = await snap.createTransaction(parameter);

        await prisma.midtransTransaction.create({
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
            where: { id: order.id },
            data: { payement_status: "pending" }
        });

        return res.status(201).json({
            message: "Transaksi berhasil dibuat",
            data: {
                snapToken: transaction.token,
                redirectUrl: transaction.redirect_url,
                midtransOrderId,
            }
        });

    } catch (error) {
        next(error);
    }
};

export const handleNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = req.body;
        const statusResponse = await coreApi.transaction.notification(notification);

        const result = await syncTransactionStatus(statusResponse);

        if (!result.found) {
            console.warn(`Notifikasi diterima untuk order_id yang tidak dikenal: ${statusResponse.order_id}`);
            return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        }

        return res.status(200).json({ message: "Notifikasi berhasil diproses" });

    } catch (error) {
        next(error);
    }
};

export const getMonthlyRevenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await calculateMonthlyRevenue();
        return res.status(200).json({ message: "Success", data });
    } catch (err: any) {
        next(err)
    }
}

export const checkTransactionStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const midtransOrderId = req.params.midtransOrderId as string;

        const statusResponse = await coreApi.transaction.status(midtransOrderId);
        const result = await syncTransactionStatus(statusResponse);

        if (!result.found) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan di database" });
        }

        return res.status(200).json({
            message: "Status berhasil disinkronkan",
            data: { status: result.status }
        });

    } catch (error) {
        next(error);
    }
};