require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Успішне зʼєднання з базою даних!');

    // Додавання барберів
    await connection.query(`
      INSERT INTO barbers (name, experience_years, description, photo_url)
      VALUES 
        ('Андрій Коваленко', 5, 'Експерт класичних чоловічих стрижок.', 'https://example.com/barber1.jpg'),
        ('Ігор Мельник', 3, 'Спеціаліст з fade-стрижок і бритья небезпечною бритвою.', 'https://example.com/barber2.jpg'),
        ('Владислав Демчук', 7, 'Перукар-універсал, з досвідом за кордоном.', 'https://example.com/barber3.jpg')
    `);

    // Додавання послуг
    await connection.query(`
      INSERT INTO services (name, description, price)
      VALUES 
        ('Чоловіча стрижка', 'Класична або сучасна стрижка.', 400.00),
        ('Стрижка бороди', 'Оформлення бороди та вусів.', 250.00),
        ('Королівське гоління', 'Гарячі рушники, піна, небезпечна бритва.', 350.00),
        ('Стрижка + борода', 'Комплекс: стрижка волосся і бороди.', 600.00)
    `);

    // Додавання клієнтів
    await connection.query(`
      INSERT INTO clients (full_name, phone_number, email)
      VALUES 
        ('Максим Шевченко', '+380631112233', 'maksym.shev@example.com'),
        ('Олександр Пилипчук', '+380501234567', 'oleksandr.p@example.com'),
        ('Ірина Гончар', '+380671234789', 'iryna.gonchar@example.com')
    `);

    // Додавання записів
    await connection.query(`
      INSERT INTO bookings (client_id, service_id, barber_id, date, time)
      VALUES 
        (1, 1, 1, '2025-06-27', '13:00:00'),
        (2, 3, 2, '2025-06-28', '16:30:00'),
        (3, 4, 3, '2025-06-29', '12:00:00')
    `);

    console.log('✅ Дані успішно додано до бази!');
    await connection.end();
  } catch (error) {
    console.error('❌ Помилка при заповненні бази:', error);
  }
}

seedDatabase();
