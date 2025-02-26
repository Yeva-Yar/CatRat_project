const createServer = require("http").createServer;
const fs = require("fs");
const path = require("path");
const static = require("./static");
const db = require("./db");

db.query("SELECT * FROM `Users` LIMIT 100", (err, rows) => {
    console.log(rows);
});

createServer(function(req, res) {
    static(req, res);
}).listen(3000, ()=>console.log("server started http://localhost:3000"));