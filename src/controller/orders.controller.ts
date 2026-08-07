import { Request, Response, NextFunction } from "express"
import { prisma } from '../../lib/prisma'

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { customerId, barberId, serviceStatus, paymentStatus, checkinTime, notes } = req.body;

        if (!customerId || !barberId) {
            return res.status(400).json({ mesage: "Semua wajib di isi!" })
        }

        const newOrder = await prisma.order.create({
            data: {
                customerId,
                barberId,
                service_status: serviceStatus,
                payement_status: paymentStatus,
                checkin_time: checkinTime,
                notes
            }
        })

        return res.status(201).json({
            message: "Success create new order",
            data: newOrder
        })

    } catch (error) {
        next(error)
    }
}

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allOrders = await prisma.order.findMany({
            include: {
                customer: { select: { name: true } },
                barber: { select: { name: true } }
            }
        });

        return res.status(200).json({
            message: "Success",
            data: allOrders
        })

    } catch (error) {
        next(error)
    }
}

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const getOrderDetail = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: {
                customer: { select: { name: true } },
                barber: { select: { name: true } }
            }
        })

        if (!getOrderDetail) {
            return res.status(404).json({ message: "Order not found" })
        }

        return res.status(200).json({
            message: "Success get order detail",
            data: getOrderDetail
        })

    } catch (error) {
        next(error)
    }
}


const status_order: Record<string, string[]> = {
    waiting: ["in_service"],
    in_service: ["completed"],
    completed: [],
}

export const updateStatusOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const getOrder = await prisma.order.findUnique({
            where: { id: Number(id) }
        })

        if (!getOrder) {
            return res.status(404).json({ message: "Order cant found" })
        }

        const allowed = status_order[getOrder.service_status];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Status tidak sesuai" })
        }

        const updated = await prisma.order.update({
            where: { id: Number(id) },
            data: { service_status: status },
        })

        return res.status(204).json({
            message: "Success update order status"
        })

    } catch (error) {
        next(error)
    }
}