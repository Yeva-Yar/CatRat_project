const createServer = require("http").createServer;
const fs = require("fs");
const path = require("path");
const static = require("./static");


createServer(function(req, res) {
    static(req, res);
}).listen(3000, ()=>console.log("server started http://localhost:3000"));