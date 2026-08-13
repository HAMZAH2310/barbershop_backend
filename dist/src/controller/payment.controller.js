"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = exports.getPayment = void 0;
const prisma_1 = require("../../lib/prisma");
const generateInvoice_1 = __importDefault(require("../utils/generateInvoice"));
const getPayment = async (req, res, next) => {
    const { orderId } = req.query;
    try {
        const where = orderId ? { orderId: Number(orderId) } : {};
        const payment = await prisma_1.prisma.payment.findMany({
            where,
            include: {
                order: {
                    include: { customer: true, barber: true, orderItems: true }
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(payment);
    }
    catch (error) {
        next(error);
    }
};
exports.getPayment = getPayment;
const createPayment = async (req, res, next) => {
    const { orderId, amountRecived, paymentMethod } = req.body;
    if (!orderId || !amountRecived || !paymentMethod) {
        return res.status(400).json({ message: "Field wajib di Isi" });
    }
    const validMethods = ['cash', 'qris', 'card', 'other'];
    if (!validMethods.includes(paymentMethod)) {
        return res.status(400).json({ message: "Method pembayaran tidak valid!" });
    }
    try {
        const order = await prisma_1.prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: { orderItems: true },
        });
        if (!order) {
            return res.status(400).json({ message: "Order tidak ada!" });
        }
        if (order.payement_status === 'paid') {
            return res.status(400).json({ message: "Order sudah di bayar!" });
        }
        if (order.service_status !== "completed") {
            return res.status(400).json({ message: "Order belum selesai! Tidak bisa melakukan pembayaran!" });
        }
        const totalOrder = order.orderItems.reduce((sum, item) => sum + item.price, 0);
        if (amountRecived < totalOrder) {
            return res.status(400).json({ message: "Uang yang dibayarkan tidak cukup!" });
        }
        const change = amountRecived - totalOrder;
        const [payment, updateOrder] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.payment.create({
                data: {
                    orderId: Number(order.id),
                    amountReceived: amountRecived,
                    change,
                    paymentMethod
                },
            }),
            prisma_1.prisma.order.update({
                where: { id: Number(order.id) },
                data: { payement_status: "paid" }
            }),
            prisma_1.prisma.invoice.create({
                data: {
                    orderId: Number(order.id),
                    invoiceNo: (0, generateInvoice_1.default)(order.id),
                    totalAmount: totalOrder,
                    paidAt: new Date(),
                    status: "paid"
                }
            })
        ]);
        return res.status(201).json({
            message: "Success payment",
            data: {
                payment,
                order: updateOrder,
                totalOrder,
                change,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createPayment = createPayment;
