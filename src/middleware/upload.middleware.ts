import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedType = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedType.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP"))
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

export default upload