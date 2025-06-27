const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Підключення до БД
const connection = mysql.createConnection({
  host: "ballast.proxy.rlwy.net",  // 🔁 заміни
  user: "root",
  password: "ZYcNwquBRicUSuZDROzlGDPlfoKJfqUD",                     // 🔁 заміни
  database: "railway",
  port: 46916                                   // 🔁 заміни
});

// 🔄 Старт з'єднання
connection.connect((err) => {
  if (err) {
    console.error("❌ Помилка з'єднання з БД:", err);
  } else {
    console.log("✅ Підключено до бази даних");
  }
});

// 📨 Обробка форми
app.post("/book", (req, res) => {
  const { fullName, email, phone, service, barber, date, time } = req.body;

  // 1. Додати клієнта
  const insertCustomer = `INSERT INTO customers (full_name, email, phone_number) VALUES (?, ?, ?)`;
  connection.query(insertCustomer, [fullName, email, phone], (err, customerResult) => {
    if (err) {
      console.error("❌ Помилка при додаванні клієнта:", err);
      return res.status(500).send("Помилка при записі.");
    }

    const customerId = customerResult.insertId;

    // 2. Отримати ID послуги (name → id)
    const getServiceId = `SELECT id FROM services WHERE name = ?`;
    connection.query(getServiceId, [service], (err, serviceResult) => {
      if (err || serviceResult.length === 0) {
        console.error("❌ Помилка при пошуку послуги:", err);
        return res.status(500).send("Послугу не знайдено.");
      }

      const serviceId = serviceResult[0].id;

      // 3. Отримати ID барбера (name → id)
      const getBarberId = `SELECT id FROM barbers WHERE full_name LIKE ?`;
      connection.query(getBarberId, [`%${barber}%`], (err, barberResult) => {
        if (err || barberResult.length === 0) {
          console.error("❌ Помилка при пошуку барбера:", err);
          return res.status(500).send("Барбера не знайдено.");
        }

        const barberId = barberResult[0].id;

        // 4. Додати запис
        const insertAppointment = `
          INSERT INTO appointments (customer_id, service_id, barber_id, appointment_date, appointment_time)
          VALUES (?, ?, ?, ?, ?)
        `;
        connection.query(
          insertAppointment,
          [customerId, serviceId, barberId, date, time],
          (err) => {
            if (err) {
              console.error("❌ Помилка при записі:", err);
              return res.status(500).send("Не вдалося записати.");
            }

            res.send("✅ Ви успішно записались!");
          }
        );
      });
    });
  });
});

// 🚀 Запуск сервера
app.listen(port, () => {
  console.log(`🟢 Сервер працює на http://localhost:${port}`);
});
