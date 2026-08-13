"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInvoice = exports.getInvoiceById = void 0;
const prisma_1 = require("../../lib/prisma");
const node_console_1 = require("node:console");
const getInvoiceById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const invoice = await prisma_1.prisma.invoice.findUnique({
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
        res.status(200).json({ invoice });
    }
    catch {
        next(node_console_1.error);
    }
};
exports.getInvoiceById = getInvoiceById;
const getAllInvoice = async (req, res, next) => {
    try {
        const getAllinvoice = await prisma_1.prisma.invoice.findMany({
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
        return res.status(200).json({ invoice: getAllinvoice });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllInvoice = getAllInvoice;
