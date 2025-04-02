const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

// Функція для захисту маршруту
function protected(req, res) {
    // Отримуємо токен з cookie заголовка
    const token = req.headers.cookie?.split("=")[1];
    if (!token) return; // Якщо токен відсутній, функція завершується

    // Верифікація токена
    let user = jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            // Якщо токен недійсний, повертаємо помилку 403
            res.writeHead(403, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Недійсний токен" }));
        }
        return user; // Повертаємо користувача, якщо токен дійсний
    });
    return user;
}

module.exports = protected;
