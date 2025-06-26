// === server.js ===
const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// --- маршрут POST /book ---
app.post('/book', async (req, res) => {
  const { full_name, phone_number, email, service_id, barber_id, date, time } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [clientResult] = await connection.execute(
      'INSERT INTO clients (full_name, phone_number, email) VALUES (?, ?, ?)',
      [full_name, phone_number, email]
    );

    const client_id = clientResult.insertId;

    await connection.execute(
      'INSERT INTO bookings (client_id, service_id, barber_id, date, time) VALUES (?, ?, ?, ?, ?)',
      [client_id, service_id, barber_id, date, time]
    );

    await connection.end();

    res.redirect('/booking-success.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Помилка при записі');
  }
});

// --- маршрут GET /api/bookings ---
app.get('/api/bookings', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(`
      SELECT bookings.id, clients.full_name, services.name AS service, barbers.name AS barber, date, time
      FROM bookings
      JOIN clients ON bookings.client_id = clients.id
      JOIN services ON bookings.service_id = services.id
      JOIN barbers ON bookings.barber_id = barbers.id
      ORDER BY date, time;
    `);

    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error('Помилка при отриманні записів:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
