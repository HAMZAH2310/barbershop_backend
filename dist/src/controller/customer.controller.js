import { prisma } from "../../lib/prisma";
import { uploadToCloudinary } from "../../lib/uploadtoCloudinary";
export const registerCustomer = async (req, res, next) => {
    try {
        const { phone, userId } = req.body;
        if (!phone || !userId) {
            return res.status(400).json({
                message: "Field userId dan phone harus diisi"
            });
        }
        const user = await prisma.users.findUnique({
            where: { id: Number(userId) }
        });
        if (!user) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }
        let profilePicture;
        if (req.file) {
            const pictureBuffer = req.file.buffer;
            const result = await uploadToCloudinary(pictureBuffer);
            profilePicture = result.secure_url;
        }
        const newCustomer = await prisma.customer.create({
            data: {
                name: user.username,
                phone: Number(phone),
                email: user.email,
                ...(profilePicture && { profilePicture }),
            }
        });
        return res.status(201).json({
            message: "Successfully create customer",
            data: {
                id: newCustomer.id,
                name: newCustomer.name,
                phone: newCustomer.phone,
                profilePicture: newCustomer.profilePicture
            }
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAllCustomer = async (req, res, next) => {
    try {
        // const page = parseInt(req.query.page as string) || 1;
        // const limit = parseInt(req.query.limit as string) || 5; 
        const allCustomer = await prisma.customer.findMany();
        return res.status(200).json({
            message: "Success get all customer",
            data: allCustomer
        });
    }
    catch (error) {
        next(error);
    }
};
export const getCustomerDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customer.findUnique({
            where: { id: Number(id) }
        });
        if (!customer) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "User found",
            data: customer
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;
        let profilePicture;
        if (req.file) {
            const pictureBuffer = req.file.buffer;
            const result = await uploadToCloudinary(pictureBuffer);
            profilePicture = result.secure_url;
        }
        const checkCustomer = await prisma.customer.findUnique({
            where: { id: Number(id) }
        });
        if (!checkCustomer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }
        const updatedCustomer = await prisma.customer.update({
            where: { id: Number(id) },
            data: {
                name: name,
                phone: phone ? Number(phone) : undefined,
                ...(profilePicture && { profilePicture }),
            }
        });
        return res.status(204).json({
            message: "Update data successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const checkCustomer = await prisma.customer.findUnique({
            where: { id: Number(id) }
        });
        if (!checkCustomer) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        const deletedCustomer = await prisma.customer.delete({
            where: { id: Number(id) },
        });
        return res.status(204).json({
            message: "Delete data successfully"
        });
    }
    catch (error) {
        next(error);
    }
};
