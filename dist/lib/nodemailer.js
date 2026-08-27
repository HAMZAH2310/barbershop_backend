import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
transporter.verify((error) => {
    if (error) {
        console.log("Error koneksi email:", error);
    }
    else {
        console.log("✅ Email server siap kirim");
    }
});
