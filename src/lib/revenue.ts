import { prisma } from "../../lib/prisma";

export async function calculateMonthlyRevenue() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);

    const result = await prisma.invoice.aggregate({
        where: {
            status: "paid",
            paidAt: {
                gte: startOfMonth,
                lt: startOfNextMonth,
            },
        },
        _sum: { totalAmount: true },
        _count: true,
    });

    return {
        totalRevenue: result._sum.totalAmount || 0,
        totalTransactions: result._count,
        period: { from: startOfMonth, to: now },
    };
}