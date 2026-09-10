import { z } from "zod";
export const revenueFilterSchema = z.object({
    period: z.enum(["today", "this_week", "this_month", "this_year", "all_time", "custom"]).default("this_month"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});
