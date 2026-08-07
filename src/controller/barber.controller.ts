import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma"
import { uploadToCloudinary } from "../../lib/uploadtoCloudinary";

export const registerBarber = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, phone } = req.body;

        let picture: string | undefined;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "barber");
            picture = result.secure_url;
        }

        if (!name || !phone) {
            return res.status(400).json({
                message: "Field name dan phone harus diisi"
            })
        };

        const newBarber = await prisma.barber.create({
            data: {
                name,
                phone: Number(phone),
                ...(picture && { picture })
            }
        })

        return res.status(201).json({
            message: "Success Create Barber",
            data: {
                id: newBarber.id,
                name: newBarber.name,
                phone: newBarber.phone
            }
        })

    } catch (error) {
        next(error)
    }
}


export const getAllBarber = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allBarber = await prisma.barber.findMany();

        return res.status(200).json({
            data: allBarber
        })
    } catch (error) {
        next(error)
    }
}