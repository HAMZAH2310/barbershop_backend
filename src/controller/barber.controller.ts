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

export const updateStatusBarber = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatus = ['available', 'working', 'on break'];
        if (!status || !validStatus.includes(status)) {
            return res.status(400).json({
                message: "Status harus salah satu dari: available, working, on_break"
            });
        }

        const barber = await prisma.barber.findUnique({
            where: { id: Number(id) },
        })

        if (!barber) {
            return res.status(404).json({ message: "Barber tidak ditemukan" });
        }

        const updatedBarber = await prisma.barber.update({
            where: { id: barber.id },
            data: { status },
        })

        return res.status(200).json({
            message: "Status barber berhasil diupdate",
            data: updatedBarber
        });

    } catch (err: any) {
        next(err)
    }
}