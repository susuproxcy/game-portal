const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantId = process.env.TENANT_ID;
const redirectUri = "http://localhost:3000/callback";

// Function to get OAuth 2.0 token
async function getAccessToken() {
    const response = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
    }));

    return response.data.access_token;
}

// Endpoint to send the email
app.post("/send-email", async (req, res) => {
    try {
        const { email, message } = req.body;

        const token = await getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
                type: "OAuth2",
                user: "your-email@outlook.com", // Your Outlook email
                clientId: clientId,
                clientSecret: clientSecret,
                accessToken: token,
            },
        });

        const mailOptions = {
            from: "your-email@outlook.com", // Your Outlook email
            to: "sali@dateacademy.org", // Recipient email
            subject: "Key Request",
            text: `Request from ${email} - ${message}`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).send("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Failed to send email.");
    }
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
