const db = require("../../db");
const protected = require("../auth/protected");

/**
 * Функція для видалення завдання
 * @param {http.IncomingMessage} req - об'єкт запиту
 * @param {http.ServerResponse} res - об'єкт відповіді
 */
function deleteTask(req, res) {
    // Отримаємо ідентифікатор користувача з защищеної функції
    let user = protected(req, res);
    // Отримаємо ідентифікатор завдання з запиту
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id");
    // Видалимо завдання з бази даних
    db.query("DELETE FROM Tasks WHERE id=?", [taskId], function (err, result) {
        // Якщо все добре, то повертаємо успішну відповідь
        res.writeHead(200);
        res.end();
    });
}

module.exports = deleteTask;
