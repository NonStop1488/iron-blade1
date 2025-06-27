const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "ballast.proxy.rlwy.net", // ← заміни на свій
  user: "root",
  password: "ZYcNwquBRicUSuZDROzlGDPlfoKJfqUD", // ← заміни на свій
  database: "railway",
  port: 46916 // ← заміни на свій порт
});

  const createTables = [
    `CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS barbers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      experience_years INT
    )`,
    `CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      phone_number VARCHAR(20)
    )`,
    `CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT,
      service_id INT,
      barber_id INT,
      appointment_date DATE,
      appointment_time TIME,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (service_id) REFERENCES services(id),
      FOREIGN KEY (barber_id) REFERENCES barbers(id)
    )`
  ];

  let created = 0;

  createTables.forEach((sql, index) => {
    connection.query(sql, (err) => {
      if (err) {
        console.error(`❌ Помилка при створенні таблиці #${index + 1}:`, err.message);
      } else {
        console.log(`✅ Таблиця #${index + 1} створена`);
      }
      created++;
      if (created === createTables.length) {
        connection.end();
      }
    });
  });
