require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Успішне зʼєднання з базою даних!');

    // SQL-запити по одному
    await connection.query(`
      CREATE TABLE IF NOT EXISTS barbers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        experience_years INT,
        description TEXT,
        photo_url TEXT
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        description TEXT,
        price DECIMAL(10,2)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100),
        phone_number VARCHAR(20),
        email VARCHAR(100)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT,
        service_id INT,
        barber_id INT,
        date DATE,
        time TIME,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (service_id) REFERENCES services(id),
        FOREIGN KEY (barber_id) REFERENCES barbers(id)
      );
    `);

    console.log('✅ Таблиці успішно створено!');
    await connection.end();
  } catch (err) {
    console.error('❌ Помилка при створенні таблиць:', err);
  }
}

setupDatabase();
