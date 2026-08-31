import jwt from "jsonwebtoken";
import { transporter } from "./nodemailer";

export const sendVerificationEmail = async (userId: number, email: string) => {
    const verificationToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" },
    );

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    console.log("DEBUG - Verification Link:", verificationLink)

    await transporter.sendMail({
        from: `"Kafka Barbershop" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verifikasi Email",
        html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
                <h2>Verifikasi Email</h2>
                <p>Terima kasih sudah daftar. Klik tombol di bawah untuk verifikasi email kamu:</p>
                <a href="${verificationLink}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 10px;">
                   Verifikasi Email
                </a>
                <p style="margin-top: 20px; color: #666; font-size: 12px;">
                    Link ini berlaku 1 jam. Kalau kamu tidak merasa daftar, abaikan email ini.
                </p>
            </div>
        `,
    });
}