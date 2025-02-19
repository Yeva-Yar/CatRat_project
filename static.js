const fs = require("fs")
const path = require("path")

/*
* Функція яка повертатиме всі статичні файли
*/

const static = function (req, res) {
    //З ареси дізнаємось який файл в нас замовляють
    let filePath = path.join(__dirname, 'static', req.url === '/' ? 'pages/index.html' : req.url); 
    //дізнаємось тип файлу щоб встановити правельний заголовок до відповіді
    let extname = path.extname(filePath);

    //Встановлюємо заголовок залежно від типу файлу який був запитаний
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.ttf':
            contentType = 'application/x-font-ttf';
            break;
        default:
            contentType = 'text/html';
    }

    //зчитуємо файл
    fs.readFile(filePath, (err, data) => {
        // оброрбляємо помилки
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }
        } else {
            // відправляємо відповідь
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// експортуємо функцію
module.exports = static