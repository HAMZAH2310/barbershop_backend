import { prisma } from "../../lib/prisma";
import { NextFunction, Request, Response } from "express";
import { uploadToCloudinary } from "../../lib/uploadtoCloudinary";
import "multer";

export const registerCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, phone } = req.body;

        let profilePicture: string | undefined

        if (req.file) {
            const pictureBuffer = req.file.buffer;
            const result = await uploadToCloudinary(pictureBuffer);
            profilePicture = result.secure_url;
        }

        if (!name || !phone) {
            return res.status(400).json({
                message: "Field name dan phone harus diisi"
            })
        };

        const newCustomer = await prisma.customer.create({
            data: {
                name: name,
                phone: Number(phone),
                ...(profilePicture && { profilePicture }),
            }
        })

        return res.status(201).json({
            message: "SUccesfully create customer",
            data: {
                id: newCustomer.id,
                name: newCustomer.name,
                phone: newCustomer.phone,
            }
        });
    } catch (error) {
        next(error)
    }
}

export const getAllCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const page = parseInt(req.query.page as string) || 1;
        // const limit = parseInt(req.query.limit as string) || 5; 

        const allCustomer = await prisma.customer.findMany()

        return res.status(200).json({
            message: "Success get all customer",
            data: allCustomer
        })
    } catch (error) {
        next(error)
    }
}

export const getCustomerDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customer.findUnique({
            where: { id: Number(id) }
        })

        if (!customer) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User found",
            data: customer
        })

    } catch (error) {
        next(error)
    }
}

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params;
        const { name, phone } = req.body;

        let profilePicture: string | undefined

        if (req.file) {
            const pictureBuffer = req.file.buffer;
            const result = await uploadToCloudinary(pictureBuffer);
            profilePicture = result.secure_url;
        }

        const checkCustomer = await prisma.customer.findUnique({
            where: { id: Number(id) }
        })

        if (!checkCustomer) {
            return res.status(404).json({
                message: "Customer not found"
            })
        }

        const updatedCustomer = await prisma.customer.update({
            where: checkCustomer,
            data: {
                name,
                phone,
                ...(profilePicture && { profilePicture }),
            }
        })

        return res.status(204).json({
            message: "Update data successfully",
        })

    } catch (error) {
        next(error)
    }
}


export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const checkCustomer = await prisma.customer.findUnique({
            where: { id: Number(id) }
        })

        if (!checkCustomer) {
            return res.status(404).json({
                message: "User Not Found"
            })
        }

        const deletedCustomer = await prisma.customer.delete({
            where: checkCustomer
        })

        return res.status(204).json({
            message: "Delete data successfully"
        })
    } catch (error) {
        next(error)
    }
}