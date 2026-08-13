"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerDetails = exports.getAllCustomer = exports.registerCustomer = void 0;
const prisma_1 = require("../../lib/prisma");
const uploadtoCloudinary_1 = require("../../lib/uploadtoCloudinary");
require("multer");
const registerCustomer = async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        let profilePicture;
        if (req.file) {
            const pictureBuffer = req.file.buffer;
            const result = await (0, uploadtoCloudinary_1.uploadToCloudinary)(pictureBuffer);
            profilePicture = result.secure_url;
        }
        if (!name || !phone) {
            return res.status(400).json({
                message: "Field name dan phone harus diisi"
            });
        }
        ;
        const newCustomer = await prisma_1.prisma.customer.create({
            data: {
                name: name,
                phone: Number(phone),
                ...(profilePicture && { profilePicture }),
            }
        });
        return res.status(201).json({
            message: "SUccesfully create customer",
            data: {
                id: newCustomer.id,
                name: newCustomer.name,
                phone: newCustomer.phone,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerCustomer = registerCustomer;
const getAllCustomer = async (req, res, next) => {
    try {
        // const page = parseInt(req.query.page as string) || 1;
        // const limit = parseInt(req.query.limit as string) || 5; 
        const allCustomer = await prisma_1.prisma.customer.findMany();
        return res.status(200).json({
            message: "Success get all customer",
            data: allCustomer
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCustomer = getAllCustomer;
const getCustomerDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await prisma_1.prisma.customer.findUnique({
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
exports.getCustomerDetails = getCustomerDetails;
const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;
        let profilePicture;
        if (req.file) {
            const pictureBuffer = req.file.buffer;
            const result = await (0, uploadtoCloudinary_1.uploadToCloudinary)(pictureBuffer);
            profilePicture = result.secure_url;
        }
        const checkCustomer = await prisma_1.prisma.customer.findUnique({
            where: { id: Number(id) }
        });
        if (!checkCustomer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }
        const updatedCustomer = await prisma_1.prisma.customer.update({
            where: checkCustomer,
            data: {
                name,
                phone,
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
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const checkCustomer = await prisma_1.prisma.customer.findUnique({
            where: { id: Number(id) }
        });
        if (!checkCustomer) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        const deletedCustomer = await prisma_1.prisma.customer.delete({
            where: checkCustomer
        });
        return res.status(204).json({
            message: "Delete data successfully"
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCustomer = deleteCustomer;
