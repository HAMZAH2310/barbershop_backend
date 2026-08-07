import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";

import generateInvoice from "../utils/generateInvoice"

export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.query;

    try {
        const where = orderId ? { orderId: Number(orderId) } : {};
        const payment = await prisma.payment.findMany({
            where,
            include: {
                order: {
                    include: { customer: true, barber: true, orderItems: true }
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(payment)
    } catch (error) {
        next(error)
    }
}



export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, amountRecived, paymentMethod } = req.body;

    if (!orderId || !amountRecived || !paymentMethod) {
        return res.status(400).json({ message: "Field wajib di Isi" })
    }

    const validMethods = ['cash', 'qris', 'card', 'other'];

    if (!validMethods.includes(paymentMethod)) {
        return res.status(400).json({ message: "Method pembayaran tidak valid!" })
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: { orderItems: true },
        })

        if (!order) {
            return res.status(400).json({ message: "Order tidak ada!" })
        }

        if (order.payement_status === 'paid') {
            return res.status(400).json({ message: "Order sudah di bayar!" })
        }

        if (order.service_status !== "completed") {
            return res.status(400).json({ message: "Order belum selesai! Tidak bisa melakukan pembayaran!" })
        }

        const totalOrder = order.orderItems.reduce((sum, item) => sum + item.subtotal, 0);

        if (amountRecived < totalOrder) {
            return res.status(400).json({ message: "Uang yang dibayarkan tidak cukup!" })
        }

        const change = amountRecived - totalOrder;

        const [payment, updateOrder] = await prisma.$transaction([
            prisma.payment.create({
                data: {
                    orderId: Number(order.id),
                    amountReceived: amountRecived,
                    change,
                    paymentMethod
                },
            }),

            prisma.order.update({
                where: { id: Number(order.id) },
                data: { payement_status: "paid" }
            }),

            prisma.invoice.create({
                data: {
                    orderId: Number(order.id),
                    invoiceNo: generateInvoice(order.id),
                    totalAmount: totalOrder,
                    paidAt: new Date(),
                    status: "paid"

                }
            })
        ])
        return res.status(201).json({
            message: "Success payment",
            data: {
                payment,
                order: updateOrder,
                totalOrder,
                change,
            }
        })
    } catch (error) {
        next(error);
    }
}

