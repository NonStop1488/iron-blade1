const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;

app.post('/book', async (req, res) => {
  const { full_name, phone_number, email, service_id, barber_id, date, time } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Додати клієнта
    const [clientResult] = await connection.execute(
      'INSERT INTO clients (full_name, phone_number, email) VALUES (?, ?, ?)',
      [full_name, phone_number, email]
    );

    const client_id = clientResult.insertId;

    // Додати запис
    await connection.execute(
      'INSERT INTO bookings (client_id, service_id, barber_id, date, time) VALUES (?, ?, ?, ?, ?)',
      [client_id, service_id, barber_id, date, time]
    );

    await connection.end();

    res.send('<h2>✅ Ви успішно записались!</h2><a href="/">Повернутись на головну</a>');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Помилка при записі.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на порту ${PORT}`);
});
