import { prisma } from "../../lib/prisma";
export const getAllOrderItems = async (req, res, next) => {
    try {
        const { orderId } = req.query;
        const where = orderId ? { orderId: Number(orderId) } : {};
        const items = await prisma.orderItems.findMany({
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
export const createItemOrder = async (req, res, next) => {
    try {
        const { orderId, serviceId, qty } = req.body;
        if (!orderId || !serviceId || !qty) {
            return res.status(400).json({ message: "orderId, serviceId, dan qty harus diisi" });
        }
        const qtyNum = Number(qty);
        if (isNaN(qtyNum) || qtyNum <= 0) {
            return res.status(400).json({ message: "qty harus berupa angka lebih dari 0" });
        }
        const service = await prisma.services.findUnique({
            where: { id: Number(serviceId) },
        });
        if (!service) {
            return res.status(404).json({ message: "Service tidak ditemukan" });
        }
        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) }
        });
        if (!order) {
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }
        const subtotal = service.price * qtyNum;
        const newItemOrder = await prisma.orderItems.create({
            data: {
                orderId,
                serviceId,
                duration: service.duration,
                price: service.price,
                qty,
                subtotal,
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
export const getOrderItems = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { orderId } = req.body;
        const item = await prisma.orderItems.findUnique({
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
export const updateItemOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { duration, price, qty, subtotal } = req.body;
        const orderItem = await prisma.orderItems.findUnique({
            where: { id: Number(id) }
        });
        if (!orderItem) {
            return res.status(404).json({ message: "Order tidak ditemukan!" });
        }
        const updateOrderItem = await prisma.orderItems.update({
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
export const deleteOrderItem = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedOrderItem = await prisma.orderItems.delete({
            where: { id: Number(id) }
        });
        return res.status(204);
    }
    catch (error) {
        next(error);
    }
};
