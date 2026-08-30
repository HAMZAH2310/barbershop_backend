import { Request, Response, NextFunction } from "express"
import { prisma } from '../../lib/prisma'
import { io } from "../index";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { barberId, notes } = req.body;

        if (!barberId) {
            return res.status(400).json({ message: "barberId wajib diisi!" })
        }

        let customer = await prisma.customer.findUnique({
            where: { userId }
        });

        if (!customer) {
            const user = await prisma.users.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(401).json({ message: "User tidak ditemukan" });
            }
            customer = await prisma.customer.create({
                data: {
                    userId: user.id,
                    name: user.username,
                    email: user.email,
                    phone: 0,
                }
            });
        }

        const barber = await prisma.barber.findUnique({ where: { id: Number(barberId) } });

        if (!barber) {
            return res.status(404).json({ message: "Barber tidak ditemukan" });
        }

        if (barber.status === "on_break") {
            return res.status(400).json({
                message: "Barber sedang istirahat, silakan pilih barber lain atau tunggu"
            });
        }

        const existingActiveOrder = await prisma.order.findFirst({
            where: {
                customerId: customer.id,
                service_status: { in: ["waiting", "in_service"] }
            }
        })

        if (existingActiveOrder) {
            return res.status(400).json({
                message: "Kamu masih punya booking aktif yang belum selesai"
            });
        }

        let queueNumber: number | null = null;
        let initialServiceStatus: "waiting" | "in_service" = "waiting";

        if (barber.status === "available") {
            initialServiceStatus = "in_service";

            const updatedBarber = await prisma.barber.update({
                where: { id: barber.id },
                data: { status: "working" }
            });

            io.emit("barber:statusUpdated", updatedBarber);

        } else if (barber.status === "working") {
            const lastQueue = await prisma.order.findFirst({
                where: {
                    barberId: barber.id,
                    service_status: "waiting",
                    queueNumber: { not: null }
                },
                orderBy: { queueNumber: "desc" }
            });

            queueNumber = lastQueue?.queueNumber ? lastQueue.queueNumber + 1 : 1;
        }

        const newOrder = await prisma.order.create({
            data: {
                customerId: customer.id,
                barberId: barber.id,
                notes: notes || "",
                service_status: initialServiceStatus,
                queueNumber,
            }
        })

        return res.status(201).json({
            message: queueNumber
                ? `Order berhasil dibuat. Nomor antrian kamu: ${queueNumber}`
                : "Order berhasil dibuat, barber siap melayani sekarang",
            data: newOrder
        })

    } catch (err: any) {
        next(err)
    }
}

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allOrders = await prisma.order.findMany({
            include: {
                customer: { select: { name: true } },
                barber: { select: { name: true } },
                orderItems: { include: { service: { select: { name: true } } } },
                midtransTransaction: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: { midtransOrderId: true }
                }
            }
        });

        return res.status(200).json({ message: "Success", data: allOrders })
    } catch (error) {
        next(error)
    }
}

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        const customer = await prisma.customer.findUnique({ where: { userId } });

        if (!customer) {
            return res.status(200).json({ message: "Success", data: [] });
        }

        const orders = await prisma.order.findMany({
            where: { customerId: customer.id },
            include: {
                barber: { select: { name: true } },
                orderItems: { include: { service: { select: { name: true } } } },
            },
            orderBy: { checkin_time: "desc" },
        });

        return res.status(200).json({ message: "Success", data: orders });

    } catch (error) {
        next(error);
    }
};

export const getQueuePosition = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({ where: { id: Number(id) } });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.service_status === "in_service") {
            return res.status(200).json({ message: "Sedang dilayani sekarang" });
        }

        if (order.service_status === "completed") {
            return res.status(200).json({ message: "Order sudah selesai" });
        }

        if (!order.queueNumber) {
            return res.status(200).json({ message: "Order sedang diproses" });
        }

        const peopleAhead = await prisma.order.count({
            where: {
                barberId: order.barberId,
                service_status: "waiting",
                queueNumber: { lt: order.queueNumber }
            }
        });

        return res.status(200).json({
            message: `Nomor antrian kamu: ${order.queueNumber}`,
            data: { queueNumber: order.queueNumber, peopleAhead }
        });

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

        io.emit("order:statusUpdated", updated)

        if (status === "completed") {
            const nextInQueue = await prisma.order.findFirst({
                where: {
                    barberId: getOrder.barberId,
                    service_status: "waiting",
                    queueNumber: { not: null }
                },
                orderBy: { queueNumber: "asc" }
            });

            if (nextInQueue) {
                await prisma.order.update({
                    where: { id: nextInQueue.id },
                    data: { service_status: "in_service" }
                });

                return res.status(200).json({
                    message: `Order selesai. Order #${nextInQueue.id} (antrian ${nextInQueue.queueNumber}) sekarang dilayani`,
                    data: updated
                })
            } else {
                await prisma.barber.update({
                    where: { id: getOrder.barberId },
                    data: { status: "available" }
                });



                return res.status(200).json({
                    message: "Order selesai. Tidak ada antrian, barber kembali tersedia",
                    data: updated
                })
            }
        }

        return res.status(200).json({
            message: "Success update order status",
            data: updated
        })

    } catch (error) {
        next(error)
    }
}

