const createServer = require("http").createServer;
const fs = require("fs");
const path = require("path");
const static = require("./static");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

createServer(function (req, res) {
    try {
        let isStatic = static(req, res);
        if (isStatic) return;
        if (req.method === "POST" && req.url === "/api/register") {
            register(req, res);
        } else if (req.method === "POST" && req.url === "/api/login") {
            login(req, res);
        } else if (req.url == "/api/createChild") {
            let user = protected(req, res);
            createChild(req, res, user.id);
        } else if (req.url == "/api/childLogin") {
            let user = protected(req, res);
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
        }
        else if (req.url == "/api/getchildrentasks") {
            getChildrenTasks(req, res);
        }
        else if (req.url.startsWith("/api/gettask")) {
            getTask(req, res);
        }
        else if (req.url.startsWith("/api/completeTask")) {
            completeTask(req, res);
        }
        else if (req.url.startsWith("/api/uncompleteTask")) {
            unCompleteTask(req, res);
        }
        else if (req.url.startsWith("/api/getMoney")) {
            getMoney(req, res);
        }
        else if (req.url == "/") {
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
                        res.end("404 not found");
                    } else {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(data);
                    }
                }
            );
        } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("404 not found");
        }
    } catch (e) {
        console.log("Error: ", e);
    }
}).listen(3000, () => console.log("Server started http://localhost:3000"));

function register(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        const { login, password, name, surname } = JSON.parse(body);
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO Users (login, password, name, surname) VALUES (?, ?, ?, ?)";
        db.query(sql, [login, hashedPassword, name, surname], (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Помилка реєстрації" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({ message: "Користувач зареєстрований" })
                );
            }
        });
    });
}

function login(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", () => {
        const { login, password } = JSON.parse(body);
        const sql = "SELECT * FROM Users WHERE login = ?";
        db.query(sql, [login], async (err, results) => {
            if (err || results.length === 0) {
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Невірні дані" }));
            }
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Невірні дані" }));
            }
            const token = jwt.sign(
                { id: user.id, login: user.login },
                SECRET_KEY,
                { expiresIn: "336h" }
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ token }));
        });
    });
}

function protected(req, res) {
    const token = req.headers.cookie?.split("=")[1];
    if (!token) return;
    let user = jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.writeHead(403, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Недійсний токен" }));
        }
        return user;
    });
    return user;
}

let createChild = (req, res, parent_id) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        const { name, email } = JSON.parse(body);
        const token = jwt.sign({ name, email, parent_id }, SECRET_KEY);
        const sql = "INSERT INTO MicroUsers (parent_id, code) VALUES (?, ?)";
        db.query(sql, [parent_id, token], (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Помилка реєстрації" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ code: token }));
            }
        });
    });
};

let childLogin = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", () => {
        body = JSON.parse(body);
        const code = body.code;
        db.query(
            "SELECT * FROM Children WHERE code = ?",
            [code],
            (err, results) => {
                if (err || results.length === 0) {
                    res.writeHead(401, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Невірні дані" }));
                } else {
                    res.end(JSON.stringify({ status: "ok" }));
                }
            }
        );
    });
};

function getChildren(req, res) {
    let user = protected(req, res);
    db.query(
        "SELECT * FROM MicroUsers WHERE parent_id = ?",
        [user.id],
        function (err, result) {
            result = result.map((child) => {
                child.name = jwt.verify(child.code, SECRET_KEY).name;
                return child;
            });
            res.writeHead(200, { "constent-type": "text/json" });
            res.end(JSON.stringify(result));
        }
    );
}

function deleteChild(req, res) {
    let user = protected(req, res);
    let childId = new URLSearchParams(req.url.split("?")[1]).get("id");
    db.query(
        "DELETE FROM MicroUsers WHERE id=?",
        [childId],
        function (err, result) {
            res.writeHead(200);
            res.end();
        }
    );
}

function addTask(req, res) {
    let user = protected(req, res);
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
        data = JSON.parse(data);
        db.query(
            "INSERT INTO Tasks(task, author, rab, price, complete) values(?, ?, ?, ?, ?)",
            [data.task, user.id, data.rab, data.price, false],
            function (err, result) {
                console.log(err);
                res.end();
            }
        );
    });
}

function getParentsTasks(req, res) {
    let user = protected(req, res);
    db.query(
        "SELECT * FROM Tasks WHERE author = ?",
        [user.id],
        (err, result) => {
            res.writeHead(200, { "content-type": "text/json" });
            res.end(JSON.stringify(result));
        }
    );
}

function deleteTask(req, res) {
    protected(req, res);
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id");
    db.query("DELETE FROM Tasks WHERE id=?", [taskId], function (err, result) {
        res.writeHead(200);
        res.end();
    });
}



function acceptTask(req, res) {
    let user = protected(req, res);
    let params = new URLSearchParams(req.url.split("?")[1]);
    let taskId = params.get("id");
    let price = params.get("price");
    let rab = params.get("rab");
    db.query("DELETE FROM Tasks WHERE id=?", [taskId], function (err, result) {
        db.query(
            "UPDATE MicroUsers SET score = score + ? WHERE id=?",
            [price, rab],
            function (err, result) {
                res.writeHead(200);
                res.end();
            }
        );
    });
}

function getChildrenTasks(req, res) {
    let user = protected(req, res);
    const token = req.headers.cookie?.split("=")[1];
    db.query(
        "select t.*, u.score from Tasks t join MicroUsers u on t.rab = u.id where u.code = ?",
        [token],
        (err, result) => {
            res.writeHead(200, { "content-type": "text/json" });
            res.end(JSON.stringify(result));
        }
    );
}

function getTask(req, res) {
    let user = protected(req, res);
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id");
    db.query("SELECT * FROM Tasks WHERE id=?", [taskId], function (err, result) {
        console.log(result);
        res.writeHead(200, { "content-type": "text/json" });
        res.end(JSON.stringify(result));
    });
}


function completeTask(req, res) {
    let user = protected(req, res);
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id");
    db.query(
        "UPDATE Tasks SET complete = 1 WHERE id=?",
        [taskId],
        function (err, result) {
            res.writeHead(200);
            res.end();
        }
    );
}

function unCompleteTask(req, res) {
    let user = protected(req, res);
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id");
    db.query(
        "UPDATE Tasks SET complete = 0 WHERE id=?",
        [taskId],
        function (err, result) {
            res.writeHead(200);
            res.end();
        }
    );
}

function getMoney(req, res) {
    let user = protected(req, res);
    let taskId = new URLSearchParams(req.url.split("?")[1]).get("id");
    let value = new URLSearchParams(req.url.split("?")[1]).get("value");
    db.query(
        "UPDATE MicroUsers SET score = score - ? WHERE id=?",
        [value, taskId],
        function (err, result) {
            res.writeHead(200);
            res.end();
        }
    );
}