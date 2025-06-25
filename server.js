require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статичні файли (index.html, booking.html, і т.д.)
app.use(express.static(path.join(__dirname, 'public')));

// Обробка форми запису
app.post('/api/appointments', async (req, res) => {
  const { client_name, client_phone, barber_id, service_id, date, time } = req.body;

  try {
    await pool.execute(
      'INSERT INTO appointments (client_name, client_phone, service_id, barber_id, date, time) VALUES (?, ?, ?, ?, ?, ?)',
      [client_name, client_phone, service_id, barber_id, date, time]
    );
    res.status(201).json({ message: 'Запис створено' });
  } catch (err) {
    console.error('Помилка при записі:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
