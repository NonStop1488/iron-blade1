const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute('SELECT NOW() AS now');
    console.log('✅ Зʼєднання успішне:', rows);
    await connection.end();
  } catch (err) {
    console.error('❌ Помилка зʼєднання з БД:', err);
  }
}

testConnection();
