import { prisma } from "../../lib/prisma";
export async function calculateMonthlyRevenue() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const result = await prisma.midtransTransaction.aggregate({
        where: {
            transactionStatus: "settlement",
            transactionTime: {
                gte: startOfMonth,
                lt: startOfNextMonth,
            },
        },
        _sum: { grossAmount: true },
        _count: true,
    });
    return {
        totalRevenue: result._sum.grossAmount || 0,
        totalTransactions: result._count,
        period: { from: startOfMonth, to: now },
    };
}
