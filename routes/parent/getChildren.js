const db = require("../../db");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const protected = require("../auth/protected");

// функція для отримання списку дітей користувача
function getChildren(req, res) {
    // отримуємо користувача з защищеної функції
    let user = protected(req, res);

    // запит до бази даних для отримання списку дітей
    db.query(
        "SELECT * FROM MicroUsers WHERE parent_id = ?",
        [user.id],
        function (err, result) {
            // якщо виникла помилка, то повертаємо помилку
            if (err) {
                res.writeHead(500, { "content-type": "text/json" });
                res.end(JSON.stringify({ message: "server error" }));
                return;
            }

            // коди дітей розшифровуємо за допомогою jwt
            result = result.map((child) => {
                child.name = jwt.verify(child.code, SECRET_KEY).name;
                return child;
            });

            // повертаємо успішну відповідь
            res.writeHead(200, { "content-type": "text/json" });
            res.end(JSON.stringify(result));
        }
    );
}

module.exports = getChildren;
