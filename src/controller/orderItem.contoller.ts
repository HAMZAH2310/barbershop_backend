import { Request, Response, NextFunction } from "express"
import { prisma } from "../../lib/prisma"


export const getAllOrderItems = async (req: Request, res: Response, next: NextFunction) => {
   try{
    const {orderId} = req.query;

    const where = orderId ? {orderId: Number(orderId)}: {};

    const items = await prisma.orderItems.findMany({
        where,
        include: {service: true}
    })

    return res.status(200).json({
        message: "Success",
        data: items,
    })
   }catch(err: any){
    next(err)
   }
}

export const createItemOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId, serviceId, duration, price, qty, subtotal } = req.body;

        if (!orderId || !serviceId || !duration || !price || !qty) {
            return res.status(400).json({ message: "Semua Field harus diisi" })
        }

        const newItemOrder = await prisma.orderItems.create({
            data: {
                orderId,
                serviceId,
                duration,
                price,
                qty,
                subtotal: price * qty,
            }
        })

        return res.status(201).json({
            message: "Success Add Item Order",
            data: { newItemOrder }
        })

    } catch (error) {
        next(error)
    }
}

export const getOrderItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { orderId } = req.body;

        const item = await prisma.orderItems.findUnique({
            where: { id: Number(id) },
            include: { service: true },
        })

        if (!item) {
            return res.status(404).json({
                message: "Item not Found"
            })
        }

        if (orderId && item.orderId !== Number(orderId)) {
            return res.status(400).json({ message: "Items tidak sesuai dengan order-id" })
        }

        return res.status(200).json({ data: item })
    } catch (error) {
        next(error)
    }
}

export const updateItemOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const { duration, price, qty, subtotal } = req.body;

        const orderItem = await prisma.orderItems.findUnique({
            where: { id: Number(id) }
        });

        if (!orderItem) {
            return res.status(404).json({ message: "Order tidak ditemukan!" })
        }

        const updateOrderItem = await prisma.orderItems.update({
            where: orderItem,
            data: {
                duration,
                price,
                qty,
                subtotal: price * qty
            }
        })

        return res.status(204)

    } catch (error) {
        next(error)
    }
}

export const deleteOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const deletedOrderItem = await prisma.orderItems.delete({
            where: { id: Number(id) }
        })

        return res.status(204)
    } catch (error) {
        next(error)
    }
}