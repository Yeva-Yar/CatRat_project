const db = require("../../db");
const protected = require("../auth/protected");


/**
 * Функція для прийняття завдання батьком
 * @param {http.IncomingMessage} req - об'єкт запиту
 * @param {http.ServerResponse} res - об'єкт відповіді
 */
function acceptTask(req, res) {
    let user = protected(req, res);
    let params = new URLSearchParams(req.url.split("?")[1]);
    let taskId = params.get("id");
    let price = params.get("price");
    let rab = params.get("rab");

    // Видаляємо завдання з бази даних
    db.query("DELETE FROM Tasks WHERE id=?", [taskId], function (err, result) {
        if (err) {
            // якщо виникла помилка, то повертаємо помилку 500
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "server error" }));
            return;
        }

        // додаємо кошти до рахунку дитини
        db.query(
            "UPDATE MicroUsers SET score = score + ? WHERE id=?",
            [price, rab],
            function (err, result) {
                if (err) {
                    // якщо виникла помилка, то повертаємо помилку 500
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "server error" }));
                    return;
                }

                // якщо все добре, то повертаємо успішну відповідь
                res.writeHead(200);
                res.end();
            }
        );
    });
}

module.exports = acceptTask;
