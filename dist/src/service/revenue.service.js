import { prisma } from "../../lib/prisma";
export class RevenueService {
    getDateRange(filter) {
        const now = new Date();
        switch (filter.period) {
            case "today": {
                const fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                return { fromDate, toDate, type: "today" };
            }
            case "this_week": {
                const day = now.getDay();
                // Anggap Senin adalah hari pertama minggu (1 = Senin, 0 = Minggu -> 7)
                const diff = (day === 0 ? -6 : 1) - day;
                const monday = new Date(now);
                monday.setDate(now.getDate() + diff);
                monday.setHours(0, 0, 0, 0);
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                sunday.setHours(23, 59, 59, 999);
                return { fromDate: monday, toDate: sunday, type: "this_week" };
            }
            case "this_year": {
                const fromDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
                const toDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
                return { fromDate, toDate, type: "this_year" };
            }
            case "all_time": {
                const fromDate = new Date(0); // Mulai dari awal berdirinya sistem barbershop
                const toDate = new Date(now.getFullYear() + 10, 11, 31, 23, 59, 59, 999);
                return { fromDate, toDate, type: "all_time" };
            }
            case "custom": {
                if (filter.startDate && filter.endDate) {
                    const fromDate = new Date(filter.startDate);
                    fromDate.setHours(0, 0, 0, 0);
                    const toDate = new Date(filter.endDate);
                    toDate.setHours(23, 59, 59, 999);
                    return { fromDate, toDate, type: "custom" };
                }
                // Fallback jika custom tidak lengkap
                const fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                return { fromDate, toDate, type: "this_month" };
            }
            case "this_month":
            default: {
                const fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                return { fromDate, toDate, type: "this_month" };
            }
        }
    }
    resolvePaymentMethod(payment, midtrans) {
        if (payment?.paymentMethod) {
            const m = payment.paymentMethod.toLowerCase();
            if (m === "cash" || m === "tunai")
                return { code: "cash", label: "Tunai (Cash)" };
            if (m === "qris")
                return { code: "qris", label: "QRIS Kasir" };
            if (m === "card" || m === "debit" || m === "credit")
                return { code: "card", label: "Kartu Debit/Kredit" };
            return { code: m, label: payment.paymentMethod.toUpperCase() };
        }
        if (midtrans?.paymentType) {
            const m = midtrans.paymentType.toLowerCase();
            if (m.includes("qris"))
                return { code: "qris_midtrans", label: "QRIS (Midtrans)" };
            if (m.includes("bank_transfer") || m.includes("va"))
                return { code: "va_midtrans", label: "Virtual Account (Midtrans)" };
            if (m.includes("gopay") || m.includes("shopeepay"))
                return { code: "ewallet_midtrans", label: "E-Wallet (Midtrans)" };
            return { code: "midtrans", label: `Midtrans (${midtrans.paymentType})` };
        }
        return { code: "other", label: "Lainnya" };
    }
    async getRevenueRecap(filter) {
        const { fromDate, toDate, type } = this.getDateRange(filter);
        const invoices = await prisma.invoice.findMany({
            where: {
                status: "paid",
                paidAt: {
                    gte: fromDate,
                    lte: toDate,
                },
            },
            include: {
                order: {
                    include: {
                        customer: true,
                        barber: true,
                        orderItems: {
                            include: {
                                service: true,
                            },
                        },
                        payment: true,
                        midtransTransaction: {
                            orderBy: { createdAt: "desc" },
                            take: 1,
                        },
                    },
                },
            },
            orderBy: { paidAt: "desc" },
        });
        let totalRevenue = 0;
        let totalServices = 0;
        const paymentMap = new Map();
        const barberMap = new Map();
        const serviceMap = new Map();
        const dailyMap = new Map();
        const recentTransactions = [];
        for (const inv of invoices) {
            const amount = inv.totalAmount;
            totalRevenue += amount;
            const order = inv.order;
            const singlePayment = Array.isArray(order.payment) ? order.payment[0] : order.payment;
            const singleMidtrans = Array.isArray(order.midtransTransaction) ? order.midtransTransaction[0] : order.midtransTransaction;
            const resolvedMethod = this.resolvePaymentMethod(singlePayment, singleMidtrans);
            // 1. Payment Method
            const currentMethod = paymentMap.get(resolvedMethod.code) || { label: resolvedMethod.label, count: 0, revenue: 0 };
            currentMethod.count += 1;
            currentMethod.revenue += amount;
            paymentMap.set(resolvedMethod.code, currentMethod);
            // 2. Barber
            if (order.barber) {
                const currentBarber = barberMap.get(order.barber.id) || { barberName: order.barber.name, orderCount: 0, revenue: 0 };
                currentBarber.orderCount += 1;
                currentBarber.revenue += amount;
                barberMap.set(order.barber.id, currentBarber);
            }
            // 3. Service Items
            const serviceNames = [];
            if (order.orderItems && order.orderItems.length > 0) {
                for (const item of order.orderItems) {
                    totalServices += item.qty;
                    if (item.service) {
                        serviceNames.push(item.service.name);
                        const currentService = serviceMap.get(item.service.id) || { serviceName: item.service.name, quantity: 0, revenue: 0 };
                        currentService.quantity += item.qty;
                        currentService.revenue += item.subtotal;
                        serviceMap.set(item.service.id, currentService);
                    }
                }
            }
            // 4. Daily Trend
            const paidDate = inv.paidAt || inv.issuedAt;
            const dateKey = paidDate.toISOString().split("T")[0]; // YYYY-MM-DD
            const currentDaily = dailyMap.get(dateKey) || { revenue: 0, transactions: 0 };
            currentDaily.revenue += amount;
            currentDaily.transactions += 1;
            dailyMap.set(dateKey, currentDaily);
            // 5. Transaction Detail
            recentTransactions.push({
                invoiceId: inv.id,
                invoiceNo: inv.invoiceNo,
                orderId: order.id,
                customerName: order.customer?.name || "Customer",
                barberName: order.barber?.name || "Barber",
                serviceNames: serviceNames.length > 0 ? serviceNames : ["Layanan"],
                paymentMethod: resolvedMethod.label,
                totalAmount: amount,
                paidAt: (inv.paidAt || inv.issuedAt).toISOString(),
            });
        }
        const totalTransactions = invoices.length;
        const averageOrderValue = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;
        const byPaymentMethod = Array.from(paymentMap.entries()).map(([method, data]) => ({
            method,
            label: data.label,
            count: data.count,
            revenue: data.revenue,
            percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
        })).sort((a, b) => b.revenue - a.revenue);
        const byBarber = Array.from(barberMap.entries()).map(([barberId, data]) => ({
            barberId,
            barberName: data.barberName,
            orderCount: data.orderCount,
            revenue: data.revenue,
        })).sort((a, b) => b.revenue - a.revenue);
        const byService = Array.from(serviceMap.entries()).map(([serviceId, data]) => ({
            serviceId,
            serviceName: data.serviceName,
            quantity: data.quantity,
            revenue: data.revenue,
        })).sort((a, b) => b.revenue - a.revenue);
        const dailyTrend = Array.from(dailyMap.entries()).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            transactions: data.transactions,
        })).sort((a, b) => a.date.localeCompare(b.date));
        return {
            period: {
                type,
                from: fromDate.toISOString(),
                to: toDate.toISOString(),
            },
            summary: {
                totalRevenue,
                totalTransactions,
                averageOrderValue,
                totalServices,
            },
            byPaymentMethod,
            byBarber,
            byService,
            dailyTrend,
            recentTransactions,
        };
    }
}
export const revenueService = new RevenueService();
