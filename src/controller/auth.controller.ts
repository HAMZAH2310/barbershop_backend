import { Request, Response, NextFunction } from "express";
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, role } = req.body;
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                role
            }
        })

        return res.status(201).json({
            message: "Success Register",
            data: {
                username: newUser.username,
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

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Succesfully login",
            data: { token }
        })

    } catch (error) {
        next(error)
    }
}