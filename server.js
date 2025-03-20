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
        }
         else if (req.url == "/") {
            let user = protected(req, res);
            if (!user) {
                res.writeHead(302, { location: "/pages/auth/auth.html" });
                res.end();
            }
            res.writeHead(302, { "location": "/pages/parent/parent.html" });
            res.end();
        } 
        else if (req.url == "/child") {
            let user = protected(req, res);
            if (!user) {
                res.writeHead(302, { location: "/pages/auth/auth.html" });
                res.end();
            }
            res.writeHead(302, { "location": "/pages/child/index.html" });
            res.end();
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
        const token = jwt.sign(
            { name, email, parent_id },
            SECRET_KEY
        );
        const sql =
            "INSERT INTO Children (parent_id, code) VALUES (?, ?)";
        db.query(sql, [parent_id, token], (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Помилка реєстрації" }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({ code: token })
                );
            }
        });
    });
}

let childLogin = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    })
    req.on("end", () => {
        body = JSON.parse(body);
        const code = body.code;
        db.query("SELECT * FROM Children WHERE code = ?", [code], (err, results) => {
            if (err || results.length === 0) {
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Невірні дані" }));
            }
            else {
                res.end(JSON.stringify({status: "ok"}));
            }
        });
    })
}

