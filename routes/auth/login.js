let db = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

// Функція для входу користувача
function login(req, res) {
    let body = "";
    
    // Отримання даних з запиту
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        const { login, password } = JSON.parse(body);
        const sql = "SELECT * FROM Users WHERE login = ?";

        // Запит до бази даних для перевірки користувача
        db.query(sql, [login], async (err, results) => {
            if (err || results.length === 0) {
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Невірні дані" }));
            }
            const user = results[0];

            // Перевірка пароля
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Невірні дані" }));
            }

            // Створення токена для користувача
            const token = jwt.sign(
                { id: user.id, login: user.login },
                SECRET_KEY,
                { expiresIn: "336h" }
            );

            // Відправка токена у відповідь
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ token }));
        });
    });
}

module.exports = login;
