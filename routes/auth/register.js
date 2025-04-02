let db = require("../../db");
const bcrypt = require("bcrypt");

/**
 * Функція для реєстрації нового користувача
 * @param {http.IncomingMessage} req - об'єкт запиту
 * @param {http.ServerResponse} res - об'єкт відповіді
 */
function register(req, res) {
    let body = "";
    // Отримання даних з запиту
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    // Після закінчення запиту
    req.on("end", async () => {
        const { login, password, name, surname } = JSON.parse(body);
        // Хешування пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Запит до бази даних для створення нового користувача
        const sql =
            "INSERT INTO Users (login, password, name, surname) VALUES (?, ?, ?, ?)";
        db.query(sql, [login, hashedPassword, name, surname], (err) => {
            if (err) {
                // Якщо виникла помилка, то повертаємо помилку
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Помилка реєстрації" }));
            } else {
                // Якщо все добре, то повертаємо успішну відповідь
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({ message: "Користувач зареєстрований" })
                );
            }
        });
    });
}

module.exports = register;
