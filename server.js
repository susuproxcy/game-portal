const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Nodemailer SMTP setup for Outlook
const transporter = nodemailer.createTransport({
    service: 'hotmail',  // Use 'hotmail' for Outlook
    auth: {
        user: process.env.OUTLOOK_EMAIL,  // Your Outlook email
        pass: process.env.OUTLOOK_PASSWORD  // The app password you generated
    }
});

// Endpoint to send email
app.post('/send-email', (req, res) => {
    const { email, message } = req.body;

    const mailOptions = {
        from: process.env.OUTLOOK_EMAIL,
        to: 'sali@dateacademy.org',
        subject: 'Key Request',
        text: `Request from ${email} - ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error);
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
