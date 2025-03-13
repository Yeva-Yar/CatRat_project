const fs = require("fs");
const path = require("path");

/*
 * Функція яка повертатиме всі статичні файли
 */

const static = function (req, res) {
    try {
        //З ареси дізнаємось який файл в нас замовляють
        let filePath = path.join(__dirname, "static", req.url);
        //дізнаємось тип файлу щоб встановити правельний заголовок до відповіді
        let extname = path.extname(filePath);
        if (extname == "") return;
        //Встановлюємо заголовок залежно від типу файлу який був запитаний
        let contentType = "text/html";
        switch (extname) {
            case ".js":
                contentType = "text/javascript";
                break;
            case ".css":
                contentType = "text/css";
                break;
            case ".json":
                contentType = "application/json";
                break;
            case ".png":
                contentType = "image/png";
                break;
            case ".jpg":
            case ".jpeg":
                contentType = "image/jpeg";
                break;
            case ".svg":
                contentType = "image/svg+xml";
                break;
            case ".ttf":
                contentType = "application/x-font-ttf";
                break;
            default:
                contentType = "text/html";
        }

        //зчитуємо файл
        let content = fs.readFileSync(filePath);
        // content = Buffer.from(content).toString();
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
        return true;
    } catch (e) {
        console.log(e);
    }
};

// експортуємо функцію
module.exports = static;
