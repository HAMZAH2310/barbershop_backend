import { Request, Response, NextFunction } from "express"
import { prisma } from "../../lib/prisma"
import { error } from "node:console";

export const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: Number(id) },
            include: {
                order: {
                    include: {
                        customer: true,
                        barber: true,
                        orderItems: { include: { service: true } },
                        payment: true,
                    },
                },
            },
        });

        if (!invoice) {
            return res.status(400).json({ message: "Invoice tidak ada!" });
        }

        res.status(200).json({ invoice })
    } catch {
        next(error)
    }
}

export const getAllInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getAllinvoice = await prisma.invoice.findMany({
            include: {
                order: {
                    include: {
                        customer: true,
                        barber: true,
                    },
                },
            },
            orderBy: { issuedAt: "desc" }
        });

        return res.status(200).json({ invoice: getAllinvoice })
    } catch (error) {
        next(error)
    }

}