const db = require("../../db");
const protected = require("../auth/protected");

/**
 * Функція для скасування виконання задачі дитиною
 * @param {http.IncomingMessage} req - об'єкт запиту
 * @param {http.ServerResponse} res - об'єкт відповіді
 */
function unCompleteTask(req, res) {
    let user = protected(req, res);
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id");
    db.query(
        "UPDATE Tasks SET complete = 0 WHERE id=?",
        [taskId],
        function (err, result) {
            // якщо все добре, то повертаємо успішну відповідь
            res.writeHead(200);
            res.end();
        }
    );
}

module.exports = unCompleteTask;
