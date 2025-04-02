const db = require("../../db");
const protected = require("../auth/protected");

/**
 * Функція для отримання задачі за її ID.
 * @param {http.IncomingMessage} req - об'єкт запиту.
 * @param {http.ServerResponse} res - об'єкт відповіді.
 */
function getTask(req, res) {
    let user = protected(req, res); // автентифікація користувача
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id"); // витягти ID задачі з URL запиту
    // запит до бази даних для отримання задачі за ID
    db.query("SELECT * FROM Tasks WHERE id=?", [taskId], function (err, result) {
        // надсилання відповіді з даними задачі або повідомленням про помилку
        res.writeHead(200, { "content-type": "text/json" });
        res.end(JSON.stringify(result));
    });
}

module.exports = getTask;
