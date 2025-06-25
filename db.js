require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.error('❌ Не вдалося підключитися до бази:', err.message);
    return;
  }
  console.log('✅ Підключення до Railway MySQL успішне!');
});

module.exports = connection;
