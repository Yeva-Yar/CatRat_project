const db = require("../../db");

// Функція для входу дитини до системи
let childLogin = (req, res) => {
    let body = "";
    // Отримання даних з запиту
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", () => {
        // Парсинг даних з запиту
        body = JSON.parse(body);
        const code = body.code;
        // Запит до бази даних для перевірки дитини
        db.query(
            "SELECT * FROM MicroUsers WHERE code = ?",
            [code],
            (err, results) => {
                if (err || results.length === 0) {
                    // Якщо виникла помилка або не знайдено дитини, то повертаємо помилку
                    res.writeHead(401, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Невірні дані" }));
                } else {
                    // Якщо все добре, то повертаємо успішну відповідь
                    res.end(JSON.stringify({ status: "ok" }));
                }
            }
        );
    });
};

module.exports = childLogin;
