"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        const salt = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newUser = await prisma_1.prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                role
            }
        });
        return res.status(201).json({
            message: "Success Register",
            data: {
                username: newUser.username,
                role: newUser.role
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "Harus di isi!"
            });
        }
        const user = await prisma_1.prisma.users.findFirst({ where: { username } });
        if (!user) {
            return res.status(404).json({
                message: "User tidak di temukan"
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Password Salah!"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({
            message: "Succesfully login",
            data: { token }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
