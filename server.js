const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // важливо для Railway
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/"))); // статичні файли (html, css, js)


// ✅ Обробка запису з форми
app.post("/book", async (req, res) => {
  const { full_name, phone_number, email, service_id, barber_id, date, time } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Додати нового клієнта
    const [clientResult] = await connection.execute(
      "INSERT INTO clients (full_name, phone_number, email) VALUES (?, ?, ?)",
      [full_name, phone_number, email]
    );
    const clientId = clientResult.insertId;

    // Додати запис
    await connection.execute(
      "INSERT INTO bookings (client_id, service_id, barber_id, date, time) VALUES (?, ?, ?, ?, ?)",
      [clientId, service_id, barber_id, date, time]
    );

    await connection.end();

    res.send("<h2>✅ Ви успішно записались!</h2><a href='/booking.html'>← Назад</a>");
  } catch (err) {
    console.error("❌ Помилка при записі:", err);
    res.status(500).send("Сталася помилка при записі.");
  }
});


app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT bookings.id, clients.full_name, services.name AS service, barbers.name AS barber, date, time
      FROM bookings
      JOIN clients ON bookings.client_id = clients.id
      JOIN services ON bookings.service_id = services.id
      JOIN barbers ON bookings.barber_id = barbers.id
      ORDER BY date, time;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Помилка при отриманні записів:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});



// ✅ Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
});

