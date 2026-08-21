import { Request, Response, NextFunction } from "express";

export interface Authroziation extends Request {
    user?: {
        id: string;
        role: string;
        [key: string]: any;
    };
}

export const isAdmin = (req: Authroziation, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Akses ditolak! Fitur hanya untuk admin!"
            });
        }

        next();
    } catch (error: any) {
        next(error);
    }
}