const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Static fayllar (index.html, admin.html, image.png, music.mp3)
app.use(express.static(__dirname));

// MongoDB ulanish
mongoose.connect('mongodb://127.0.0.1:27017/marjona-messages', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB ulandi"))
  .catch(err => console.error("❌ MongoDB xatolik:", err));

// Schema
const MessageSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

// Xabar yuborish (POST)
app.post('/api/messages', async (req, res) => {
  try {
    const newMsg = new Message({ text: req.body.text });
    await newMsg.save();
    res.status(201).json({ message: 'Yuborildi!' });
  } catch (err) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
});

// Xabarlarni olish (GET) — faqat admin foydalanadi
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Xabarlarni olishda xatolik' });
  }
});

// Bosh sahifa (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin sahifa (admin.html)
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
});