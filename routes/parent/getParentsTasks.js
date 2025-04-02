const db = require("../../db");
const protected = require("../auth/protected");

/**
 * Функція для отримання списку завдань батька
 * @param {http.IncomingMessage} req - об'єкт запиту
 * @param {http.ServerResponse} res - об'єкт відповіді
 */
function getParentsTasks(req, res) {
    let user = protected(req, res);
    db.query(
        "SELECT * FROM Tasks WHERE author = ?",
        [user.id],
        (err, result) => {
            if (err) {
                // якщо виникла помилка, то повертаємо помилку
                res.writeHead(500, { "content-type": "text/json" });
                res.end(JSON.stringify({ message: "server error" }));
                return;
            }

            // якщо все добре, то повертаємо успішну відповідь
            res.writeHead(200, { "content-type": "text/json" });
            res.end(JSON.stringify(result));
        }
    );
}

module.exports = getParentsTasks;
