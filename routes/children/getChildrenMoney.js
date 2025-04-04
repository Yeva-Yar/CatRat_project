const db = require("../../db");
const protected = require("../auth/protected");

/**
 * Функція для отримання поточного балансу дитини
 * @param {http.IncomingMessage} req - об'єкт запиту
 * @param {http.ServerResponse} res - об'єкт відповіді
 */
function getChildrenMoney(req, res) {
    let user = protected(req, res);
    const token = req.headers.cookie?.split("=")[1];

    // запит до бази даних для отримання поточного балансу
    db.query(
        "select score, id from MicroUsers where code = ?",
        [token],
        (err, result) => {
            res.writeHead(200, { "content-type": "text/json" });
            res.end(JSON.stringify(result[0]));
        }
    );
}

module.exports = getChildrenMoney;
