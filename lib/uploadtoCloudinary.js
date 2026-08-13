import cloudinary from "./cloudinary";
import streamifier from 'streamifier';
export const uploadToCloudinary = (buffer, folder = 'profilePicture') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject(new Error('Upload gagal, tidak ada hasil dari Cloudinary'));
            resolve(result);
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
