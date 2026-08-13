"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderItem = exports.updateItemOrder = exports.getOrderItems = exports.createItemOrder = exports.getAllOrderItems = void 0;
const prisma_1 = require("../../lib/prisma");
const getAllOrderItems = async (req, res, next) => {
    try {
        const { orderId } = req.query;
        const where = orderId ? { orderId: Number(orderId) } : {};
        const items = await prisma_1.prisma.orderItems.findMany({
            where,
            include: { service: true }
        });
        return res.status(200).json({
            message: "Success",
            data: items,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllOrderItems = getAllOrderItems;
const createItemOrder = async (req, res, next) => {
    try {
        const { orderId, serviceId, duration, price, qty, subtotal } = req.body;
        if (!orderId || !serviceId || !duration || !price || !qty) {
            return res.status(400).json({ message: "Semua Field harus diisi" });
        }
        const newItemOrder = await prisma_1.prisma.orderItems.create({
            data: {
                orderId,
                serviceId,
                duration,
                price,
                qty,
                subtotal: price * qty,
            }
        });
        return res.status(201).json({
            message: "Success Add Item Order",
            data: { newItemOrder }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createItemOrder = createItemOrder;
const getOrderItems = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { orderId } = req.body;
        const item = await prisma_1.prisma.orderItems.findUnique({
            where: { id: Number(id) },
            include: { service: true },
        });
        if (!item) {
            return res.status(404).json({
                message: "Item not Found"
            });
        }
        if (orderId && item.orderId !== Number(orderId)) {
            return res.status(400).json({ message: "Items tidak sesuai dengan order-id" });
        }
        return res.status(200).json({ data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderItems = getOrderItems;
const updateItemOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { duration, price, qty, subtotal } = req.body;
        const orderItem = await prisma_1.prisma.orderItems.findUnique({
            where: { id: Number(id) }
        });
        if (!orderItem) {
            return res.status(404).json({ message: "Order tidak ditemukan!" });
        }
        const updateOrderItem = await prisma_1.prisma.orderItems.update({
            where: orderItem,
            data: {
                duration,
                price,
                qty,
                subtotal: price * qty
            }
        });
        return res.status(204);
    }
    catch (error) {
        next(error);
    }
};
exports.updateItemOrder = updateItemOrder;
const deleteOrderItem = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedOrderItem = await prisma_1.prisma.orderItems.delete({
            where: { id: Number(id) }
        });
        return res.status(204);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteOrderItem = deleteOrderItem;
