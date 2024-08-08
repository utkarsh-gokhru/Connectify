import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

function mail_sender(user_mail, otp) {
    const email = process.env.EMAIL;
    const pass = process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: pass,
        },
    });

    const mailOptions = {
        from: "BlogSphere",
        to: user_mail,
        subject: 'OTP Verification',
        text: `The OTP for verification is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            if (error.code === 'EAUTH' || error.code === 'EDNS') {
                console.error('Authentication or DNS error:', error.message);
            } else if (error.code === 'EENVELOPE') {
                console.error('Invalid recipient address:', error.message);
            } else {
                console.error('Error sending email:', error.message);
            }
        } else {
            console.log('Email sent:', info.response);
        }
    });
    
}

export default mail_sender;
