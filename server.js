const createServer = require("http").createServer;
const fs = require("fs");
const path = require("path");
const static = require("./static");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const login = require("./routes/auth/login.js");
const register = require("./routes/auth/register.js");
const protected = require("./routes/auth/protected.js");
const childLogin = require("./routes/auth/childLogin.js");
const createChild = require("./routes/parent/createChild.js");
const getChildren = require("./routes/parent/getChildren.js");
const deleteChild = require("./routes/parent/deleteChild.js");
const addTask = require("./routes/parent/addTask.js");
const getParentsTasks = require("./routes/parent/getParentsTasks.js");
const deleteTask = require("./routes/parent/deleteTask.js");
const acceptTask = require("./routes/parent/acceptTask.js");
const getChildrenTasks = require("./routes/children/getChildrenTasks.js");
const getTask = require("./routes/children/getTask.js");
const completeTask = require("./routes/children/completeTask.js");
const unCompleteTask = require("./routes/children/unCompleteTask.js");
const getMoney = require("./routes/children/getMoney.js");
const getChildrenMoney = require("./routes/children/getChildrenMoney.js");

// Створюємо сервер
createServer(function (req, res) {
    try {
        // Перевіряємо, чи є запит статичним
        let isStatic = static(req, res);
        if (isStatic) return;

        // Обробка запитів до роутів
        if (req.method === "POST" && req.url === "/api/register") {
            register(req, res);
        } else if (req.method === "POST" && req.url === "/api/login") {
            login(req, res);
        } else if (req.url == "/api/createChild") {
            let user = protected(req, res);
            createChild(req, res, user.id);
        } else if (req.url == "/api/childLogin") {
            childLogin(req, res);
        } else if (req.url == "/api/getChildren") {
            getChildren(req, res);
        } else if (req.url.startsWith("/api/deletechild")) {
            deleteChild(req, res);
        } else if (req.url == "/api/addtask") {
            addTask(req, res);
        } else if (req.url == "/api/getparentstasks") {
            getParentsTasks(req, res);
        } else if (req.url.startsWith("/api/deleteTask")) {
            deleteTask(req, res);
        } else if (req.url.startsWith("/api/acceptTask")) {
            acceptTask(req, res);
        } else if (req.url == "/api/getchildrentasks") {
            getChildrenTasks(req, res);
        } else if (req.url.startsWith("/api/gettask")) {
            getTask(req, res);
        } else if (req.url.startsWith("/api/completeTask")) {
            completeTask(req, res);
        } else if (req.url.startsWith("/api/uncompleteTask")) {
            unCompleteTask(req, res);
        } else if (req.url.startsWith("/api/getMoney")) {
            getMoney(req, res);
        } else if (req.url == ("/api/getChildrenMoney")) {
            getChildrenMoney(req, res);
        } else if (req.url == "/") {
            let user = protected(req, res);
            if (!user) {
                res.writeHead(302, { location: "/pages/auth/auth.html" });
                res.end();
            } else if (!user.parent_id) {
                res.writeHead(302, { location: "/pages/parent/parent.html" });
                res.end();
            } else {
                res.writeHead(302, { location: "/pages/child/index.html" });
                res.end();
            }
        } else if (req.url == "/auth") {
            fs.readFileSync(
                path.join(__dirname, "static", "pages", "auth", "auth.html"),
                (err, data) => {
                    if (err) {
                        res.writeHead(404, { "Content-Type": "text/html" });
                        res.end("404 не знайдено");
                    } else {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(data);
                    }
                }
            );
        } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("404 не знайдено");
        }
    } catch (e) {
        // Обробка помилок
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(e.message);
    }
}).listen(3000, () => console.log("Сервер запущений http://localhost:3000"));

