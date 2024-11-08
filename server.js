const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/send-email', (req, res) => {
    const { email } = req.body;

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.OUTLOOK_PASSWORD,
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.OUTLOOK_EMAIL,
        to: 'sali@dateacademy.org',
        subject: 'App Key',
        text: `Request for Password: ${email}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
