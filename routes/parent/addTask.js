const db = require("../../db");
const protected = require("../auth/protected");


/**
 * Функція для додавання нового завдання.
 * @param {http.IncomingMessage} req - об'єкт запиту
 * @param {http.ServerResponse} res - об'єкт відповіді
 */
function addTask(req, res) {
    // отримуємо користувача з защищеної функції
    let user = protected(req, res);
    let data = "";
    // отримуємо дані з запиту
    req.on("data", (chunk) => (data += chunk));
    // після закінчення запиту
    req.on("end", () => {
        // розбираємо отримані дані
        data = JSON.parse(data);
        // запит до бази даних для додавання нового завдання
        db.query(
            "INSERT INTO Tasks(task, author, rab, price, complete) values(?, ?, ?, ?, ?)",
            [data.task, user.id, data.rab, data.price, false],
            function (err, result) {
                // якщо виникла помилка, то повертаємо помилку
                if (err) {
                    res.writeHead(500, { "content-type": "text/json" });
                    res.end(JSON.stringify({ message: "server error" }));
                    return;
                }

                // якщо все добре, то повертаємо успішну відповідь
                res.writeHead(200, { "content-type": "text/json" });
                res.end(JSON.stringify({ message: "Task added" }));
            }
        );
    });
}

module.exports = addTask;
