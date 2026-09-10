import { revenueFilterSchema } from "../contracts/revenue.contract";
import { revenueService } from "../service/revenue.service";
export const getRevenueRecap = async (req, res, next) => {
    try {
        const validatedQuery = revenueFilterSchema.parse({
            period: req.query.period,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        });
        const recap = await revenueService.getRevenueRecap(validatedQuery);
        return res.status(200).json({
            success: true,
            data: recap,
        });
    }
    catch (error) {
        next(error);
    }
};
