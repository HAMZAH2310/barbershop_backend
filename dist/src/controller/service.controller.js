"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletedService = exports.updateService = exports.getAllServices = exports.CreateServices = void 0;
const prisma_1 = require("../../lib/prisma");
const CreateServices = async (req, res, next) => {
    try {
        const { name, duration, price } = req.body;
        if (!name || !duration || !price) {
            return res.status(404).json({
                message: "Semua field harus di isi"
            });
        }
        const newService = await prisma_1.prisma.services.create({
            data: { name, duration, price }
        });
        return res.status(201).json({
            message: "Create service successfully",
            data: {
                id: newService.id,
                name: newService.name,
                duration: newService.duration,
                price: newService.price
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.CreateServices = CreateServices;
const getAllServices = async (req, res, next) => {
    try {
        const allServices = await prisma_1.prisma.services.findMany();
        if (allServices.length === 0) {
            return res.status(200).json({ message: "Data belum ada!" });
        }
        return res.status(200).json({
            data: allServices
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllServices = getAllServices;
const updateService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, duration } = req.body;
        const services = await prisma_1.prisma.services.findUnique({
            where: { id: Number(id) }
        });
        if (!services) {
            return res.status(404).json({ message: "service not found" });
        }
        const updatedService = await prisma_1.prisma.services.update({
            where: services,
            data: { name, price, duration }
        });
        return res.status(204).json({
            message: "Successfully update service",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateService = updateService;
const deletedService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const checkService = await prisma_1.prisma.services.findUnique({
            where: { id: Number(id) }
        });
        if (!checkService) {
            return res.status(404).json({
                message: "service Not Found"
            });
        }
        const deleteService = await prisma_1.prisma.services.delete({
            where: checkService
        });
        return res.status(204).json({
            message: "Deleted Service Success"
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletedService = deletedService;
