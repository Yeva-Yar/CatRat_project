const db = require("../../db");
const protected = require("../auth/protected");


/**
 * Функція для отримання списку задач, доступних для дітей
 * @param {http.IncomingMessage} req - об'єкт запиту
 * @param {http.ServerResponse} res - об'єкт відповіді
 */
function getChildrenTasks(req, res) {
    let user = protected(req, res);
    const token = req.headers.cookie?.split("=")[1];
    
    // запит до бази даних для отримання списку задач, доступних для дітей
    db.query(
        "select t.*, u.score from Tasks t join MicroUsers u on t.rab = u.id where u.code = ?",
        [token],
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

module.exports = getChildrenTasks;
