import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "Login terlebih dahulu"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Token expired"
            })
        }
        return res.status(500).json({ message: `${error}` })
    }
}