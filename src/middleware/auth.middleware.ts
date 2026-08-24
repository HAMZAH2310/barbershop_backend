import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: number | string;
    username: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const authentication = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "Login terlebih dahulu",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Token kedaluwarsa. Silakan login kembali.",
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Token tidak valid.",
            });
        }

        return res.status(500).json({
            message: "Terjadi kesalahan pada autentikasi.",
        });
    }
};