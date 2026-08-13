"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusOrder = exports.getOrder = exports.getAllOrders = exports.createOrder = void 0;
const prisma_1 = require("../../lib/prisma");
const createOrder = async (req, res, next) => {
    try {
        const { customerId, barberId, serviceStatus, paymentStatus, checkinTime, notes } = req.body;
        if (!customerId || !barberId) {
            return res.status(400).json({ mesage: "Semua wajib di isi!" });
        }
        const newOrder = await prisma_1.prisma.order.create({
            data: {
                customerId,
                barberId,
                service_status: serviceStatus,
                payement_status: paymentStatus,
                checkin_time: checkinTime,
                notes
            }
        });
        return res.status(201).json({
            message: "Success create new order",
            data: newOrder
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createOrder = createOrder;
const getAllOrders = async (req, res, next) => {
    try {
        const allOrders = await prisma_1.prisma.order.findMany({
            include: {
                customer: { select: { name: true } },
                barber: { select: { name: true } }
            }
        });
        return res.status(200).json({
            message: "Success",
            data: allOrders
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllOrders = getAllOrders;
const getOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getOrderDetail = await prisma_1.prisma.order.findUnique({
            where: { id: Number(id) },
            include: {
                customer: { select: { name: true } },
                barber: { select: { name: true } }
            }
        });
        if (!getOrderDetail) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({
            message: "Success get order detail",
            data: getOrderDetail
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrder = getOrder;
const status_order = {
    waiting: ["in_service"],
    in_service: ["completed"],
    completed: [],
};
const updateStatusOrder = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const getOrder = await prisma_1.prisma.order.findUnique({
            where: { id: Number(id) }
        });
        if (!getOrder) {
            return res.status(404).json({ message: "Order cant found" });
        }
        const allowed = status_order[getOrder.service_status];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Status tidak sesuai" });
        }
        const updated = await prisma_1.prisma.order.update({
            where: { id: Number(id) },
            data: { service_status: status },
        });
        return res.status(204).json({
            message: "Success update order status"
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateStatusOrder = updateStatusOrder;
