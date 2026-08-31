import { Request, Response, NextFunction } from "express";
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../../lib/sendVerificationEmail";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Semua field harus di isi"
            })
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
                isVerified: false,
            }
        })

        try {
            await sendVerificationEmail(newUser.id, newUser.email);
        } catch (emailError) {
            console.error("Gagal kirim email Verifikasi", emailError);
        }

        return res.status(201).json({
            message: "Registrasi Berhasil, silahkan cek email untuk verifikasi akun",
            data: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        })

    } catch (error) {
        next(error)
    }

}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "Harus di isi!"
            })
        }

        const user = await prisma.users.findFirst({ where: { username } });
        if (!user) {
            return res.status(404).json({
                message: "User tidak di temukan"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Password Salah!"
            })
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Akun belum diverifikasi. Silakan cek email kamu." })
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Succesfully login",
            data: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        })

    } catch (error) {
        next(error)
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Logout berhasil"
        })
    } catch (err: any) {
        next(err)
    }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== "string") {
            return res.status(400).json({ message: "Token tidak ditemukan" });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (err: any) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(400).json({ message: "Link verifikasi sudah kadaluarsa" });
            }
            return res.status(400).json({ message: "Token tidak valid" });
        }

        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "Email sudah terverifikasi" });
        }

        await prisma.users.update({
            where: { id: user.id },
            data: { isVerified: true },
        })

        return res.status(200).json({ message: "Email berhasil diverifikasi" });

    } catch (error: any) {
        next(error)
    }
}

export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email sudah terverifikasi" });
        }

        await sendVerificationEmail(user.id, user.email);

        return res.status(200).json({
            message: "Link verifikasi baru berhasil dikirim"
        })

    } catch (err: any) {
        next(err)
    }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return res.status(200).json({
            message: "Success",
            data: {
                id: user.id,
                username: user.username,
                role: user.role,
            }
        });
    } catch (err: any) {
        next(err)
    }
}