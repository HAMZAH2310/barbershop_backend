"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBarber = exports.registerBarber = void 0;
const prisma_1 = require("../../lib/prisma");
const uploadtoCloudinary_1 = require("../../lib/uploadtoCloudinary");
const registerBarber = async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        let picture;
        if (req.file) {
            const result = await (0, uploadtoCloudinary_1.uploadToCloudinary)(req.file.buffer, "barber");
            picture = result.secure_url;
        }
        if (!name || !phone) {
            return res.status(400).json({
                message: "Field name dan phone harus diisi"
            });
        }
        ;
        const newBarber = await prisma_1.prisma.barber.create({
            data: {
                name,
                phone: Number(phone),
                ...(picture && { picture })
            }
        });
        return res.status(201).json({
            message: "Success Create Barber",
            data: {
                id: newBarber.id,
                name: newBarber.name,
                phone: newBarber.phone
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerBarber = registerBarber;
const getAllBarber = async (req, res, next) => {
    try {
        const allBarber = await prisma_1.prisma.barber.findMany();
        return res.status(200).json({
            data: allBarber
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBarber = getAllBarber;
