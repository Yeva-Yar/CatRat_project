const db = require("../../db");
const protected = require("../auth/protected");

/**
 * Функція для виконання задачі за її ID.
 * @param {http.IncomingMessage} req - об'єкт запиту.
 * @param {http.ServerResponse} res - об'єкт відповіді.
 */
function completeTask(req, res) {
    // автентифікація користувача
    let user = protected(req, res);
    // витягти ID задачі з URL запиту
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id");
    // оновити задачу, щоб позначити її як виконану в базі даних
    db.query(
        "UPDATE Tasks SET complete = 1 WHERE id=?",
        [taskId],
        function (err, result) {
            // надіслати відповідь, що операція була успішною
            res.writeHead(200);
            res.end();
        }
    );
}

module.exports = completeTask;

