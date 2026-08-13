import { Request, Response, NextFunction } from "express"
import { prisma } from "../../lib/prisma"

export const CreateServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, duration, price } = req.body;

        if (!name || !duration || !price) {
            return res.status(404).json({
                message: "Semua field harus di isi"
            })
        }

        const newService = await prisma.services.create({
            data: { name, duration, price }
        })

        return res.status(201).json({
            message: "Create service successfully",
            data: {
                id: newService.id,
                name: newService.name,
                duration: newService.duration,
                price: newService.price
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

        const services = await prisma.services.findUnique({
            where: { id: Number(id) }
        })

        if (!services) {
            return res.status(404).json({ message: "service not found" })
        }

        const updatedService = await prisma.services.update({
            where: services,
            data: { name, price, duration }
        });

        return res.status(204).json({
            message: "Successfully update service",
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


        const deleteService = await prisma.services.delete({
            where: checkService
        })

        return res.status(204).json({
            message: "Deleted Service Success"
        })

    } catch (error) {
        next(error)
    }
}