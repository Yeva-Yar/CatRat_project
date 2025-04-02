const jwt = require("jsonwebtoken");
const db = require("../../db");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

// Функція для створення нового користувача
let createChild = (req, res, parent_id) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        const { name } = JSON.parse(body);
        // Створення токену для користувача
        const token = jwt.sign({ name, parent_id }, SECRET_KEY);
        // Запит до бази даних для створення нового користувача
        const sql = "INSERT INTO MicroUsers (parent_id, code, score) VALUES (?, ?, 0)";
        db.query(sql, [parent_id, token], (err) => {
            if (err) {
                // Якщо виникла помилка, то повертаємо помилку
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Помилка реєстрації" }));
            } else {
                // Якщо все добре, то повертаємо успішну відповідь
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ code: token }));
            }
        });
    });
};

module.exports = createChild;
