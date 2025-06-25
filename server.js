const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Завантажити змінні середовища
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Статичні файли з кореневої папки
app.use(express.static(path.join(__dirname)));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});
