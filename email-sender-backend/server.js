// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import templates from "./templates.js";

dotenv.config();
const app = express();
const PORT = 5000;

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Random template select
function getRandomTemplate() {
  const index = Math.floor(Math.random() * templates.length);
  return templates[index];
}

// API Route
app.post("/send-emails", async (req, res) => {
  try {
    const { emails } = req.body;

    // Validation
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "Invalid request: emails are required" });
    }

    for (let email of emails) {
      const template = getRandomTemplate();

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: template.subject,
        text: template.body,
        attachments: [
          {
            filename: "Rushikesh_Tinkhede_Resume.pdf",
            path: path.join(__dirname, "resume", "Rushikesh_Tinkhede_Resume.pdf"),
          },
        ],
      });
    }

    res.status(200).json({ message: "Emails sent successfully with resume attached" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
