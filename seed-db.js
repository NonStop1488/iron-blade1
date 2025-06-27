const mysql = require("mysql2");

const connection = mysql.createConnection({
  host:     "ballast.proxy.rlwy.net",
  user:     "root",
  password: "ZYcNwquBRicUSuZDROzlGDPlfoKJfqUD",
  database: "railway",
  port: 46916,
  multipleStatements: true,
});

const insertData = `
  INSERT INTO services (name, price) VALUES
    ('Чоловіча стрижка', 300),
    ('Класичне гоління', 250),
    ('Догляд за бородою', 200);

  INSERT INTO barbers (full_name, experience_years) VALUES
    ('Олег Іванов', 5),
    ('Дмитро Коваленко', 3),
    ('Сергій Бондар', 7);
`;

connection.query(insertData, (err) => {
  if (err) throw err;
  console.log("Таблиці заповнені успішно");
  connection.end();
});
