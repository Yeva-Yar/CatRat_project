const db = require("../../db");
const protected = require("../auth/protected");

/**
 * Функція для видалення дитини
 * @param {http.IncomingMessage} req - об'єкт запиту
 * @param {http.ServerResponse} res - об'єкт відповіді
 */
function deleteChild(req, res) {
    // Отримаємо ідентифікатор користувача з запиту
    let user = protected(req, res);
    // Отримаємо ідентифікатор дитини з запиту
    let childId = new URLSearchParams(req.url.split("?")[1]).get("id");
    // Видалимо дитину з бази даних
    db.query(
        "DELETE FROM MicroUsers WHERE id=?",
        [childId],
        function (err, result) {
            // Якщо виникла помилка, то повертаємо помилку
            if (err) {
                res.writeHead(500);
                return res.end();
            }
            // Якщо все добре, то повертаємо успішну відповідь
            res.writeHead(200);
            res.end();
        }
    );
}

module.exports = deleteChild;
