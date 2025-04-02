const db = require("../../db");
const protected = require("../auth/protected");

// Функція для отримання грошей дитиною
function getMoney(req, res) {
    // Отримуємо ідентифікатор користувача з защищеної функції
    let user = protected(req, res);
    // Отримуємо ідентифікатор задачі з URL запиту
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id");
    // Отримуємо значення, яке потрібно зняти з рахунку, з URL запиту
    let value = new URLSearchParams(req.url.split("?")[1]).get("value");
    // Запит до бази даних для зняття грошей з рахунку дитини
    db.query(
        "UPDATE MicroUsers SET score = score - ? WHERE id=?", // оновлюємо рахунок дитини
        [value, taskId],
        function (err, result) {
            // Якщо все добре, то повертаємо успішну відповідь
            res.writeHead(200);
            res.end();
        }
    );
}

// Експортуємо функцію
module.exports = getMoney;
