import { Request, Response, NextFunction } from "express"
import { prisma } from "../../lib/prisma"
import { uploadToCloudinary } from "../../lib/uploadtoCloudinary"

export const CreateServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, duration, price } = req.body;
        let image: string | undefined

        if (req.file) {
            const pictureBuffer = req.file.buffer;
            const result = await uploadToCloudinary(pictureBuffer);
            image = result.secure_url;
        }

        if (!name || !duration || !price) {
            return res.status(400).json({
                message: "Semua field harus di isi"
            })
        }

        const durationNum = Number(duration);
        const priceNum = Number(price);

        if (isNaN(durationNum) || isNaN(priceNum)) {
            return res.status(400).json({
                message: "Duration dan price harus berupa angka"
            })
        }

        const newService = await prisma.services.create({
            data: {
                name,
                duration: durationNum,
                price: priceNum,
                ...(image && { image })
            }
        })

        return res.status(201).json({
            message: "Create service successfully",
            data: {
                id: newService.id,
                name: newService.name,
                duration: newService.duration,
                price: newService.price,
                ...(image && { image })
            }
        })

    } catch (error) {
        next(error)
    }
}

export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allServices = await prisma.services.findMany();

        if (allServices.length === 0) {
            return res.status(200).json({ message: "Data belum ada!" })
        }

        return res.status(200).json({
            data: allServices
        })
    } catch (error) {
        next(error)
    }
}

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, price, duration } = req.body;
        let image: string | undefined

        if (req.file) {
            const pictureBuffer = req.file.buffer;
            const result = await uploadToCloudinary(pictureBuffer);
            image = result.secure_url;
        }

        const services = await prisma.services.findUnique({
            where: { id: Number(id) }
        })

        if (!services) {
            return res.status(404).json({ message: "service not found" })
        }

        const updatedService = await prisma.services.update({
            where: { id: services.id },
            data: {
                name,
                price: Number(price),
                duration: Number(duration),
                ...(image && { image })
            }
        });

        return res.status(200).json({
            message: "Successfully update service",
            data: updatedService
        })
    } catch (error) {
        next(error)
    }
}

export const deletedService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const checkService = await prisma.services.findUnique({
            where: { id: Number(id) }
        })

        if (!checkService) {
            return res.status(404).json({
                message: "service Not Found"
            })
        }

        await prisma.services.delete({
            where: { id: checkService.id }
        })

        return res.status(200).json({
            message: "Deleted Service Success"
        })

    } catch (error) {
        next(error)
    }
}