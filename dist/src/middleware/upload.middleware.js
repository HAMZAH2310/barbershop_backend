"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedType = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedType.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP"));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});
exports.default = upload;
