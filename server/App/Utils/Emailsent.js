import nodemailer from 'nodemailer'
import dotenv from 'dotenv'; 
dotenv.config({ path: '../../.env' });


export const EmailSent = async ({ email, sub, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.APPS_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: sub,
            text: message
        };

       
        const mailSend = await transporter.sendMail(mailOptions);
        
        if (!mailSend) {
            return { success: false, message: "Failed to send email due to operational issues." };
        }

        return { success: true, message: "Email Sent Successfully!" };

    } catch (error) {
        return { 
            success: false, 
            message: "Failed to send email due to server error.",
            error: error.message 
        };
    }
};
