"use strict";
exports.__esModule = true;
//Importieren des Express-Paketes, was vorher über die package.json als Abhängigkeit angegeben wurde
var express = require("express");
var path = require("path");
var User_1 = require("./scripts/User");
var usersMapped = new Map();
var usercounter = 0;
// @ts-ignore
var router = express();
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(express.static(path.join(__dirname, 'css')));
router.use(express.static(path.join(__dirname, 'scripts')));
router.use(express.static(path.join(__dirname, 'views')));
router.listen(5796, function () {
    console.log("Server auf http://localhost:5796/ gestartet");
});
var idCounter = 0;
router.get("/", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "views/index.html");
});
router.get("/css/style.css", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/css/style.css");
});
router.get("/scripts/script.js", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/scripts/script.js");
});
router.post("/user", function (req, res) {
    res.status(200);
    var name = req.body.name;
    var vorname = req.body.vorname;
    var email = req.body.email;
    var pwd = req.body.pwd;
    var newUser;
    if (name !== undefined && vorname !== undefined && email !== undefined && pwd !== undefined) {
        name = name.trim();
        vorname = vorname.trim();
        email = email.trim();
        pwd = pwd.trim();
        if (name !== "" && vorname !== "" && email !== "" && pwd !== "") {
            newUser = new User_1.User(name, vorname, email, pwd, ++idCounter);
            usersMapped.set(newUser.id, newUser);
        }
        else {
            res.json({ succeed: false, message: "Ein oder mehrere erwarteten Felder nicht befüllt" });
            return;
        }
    }
    else {
        res.json({ succeed: false, message: "Ein oder mehrere erwarteten Felder nicht befüllt" });
        return;
    }
    res.redirect("/");
});
router["delete"]("/user/:id", function (req, res) {
    res.status(200);
    var id = Number(req.params.id);
    if (id !== undefined && usersMapped.has(id)) {
        usersMapped["delete"](id);
        res.json({ succeed: true, message: "Benutzer gelöscht" });
        return;
    }
    res.json({ succeed: false, message: "Id nicht korrekt oder Benutzer nicht vorhanden" });
});
router.post("/update", function (req, res) {
    res.status(200);
    var name = req.body.name;
    var vorname = req.body.vorname;
    var email = req.body.email;
    var id = Number(req.body.id);
    if (name !== undefined && vorname !== undefined && email !== undefined && id !== undefined) {
        name = name.trim();
        vorname = vorname.trim();
        email = email.trim();
        if (name !== "" && vorname !== "" && email !== "") {
            var modifiedUser = usersMapped.get(id);
            modifiedUser.name = name;
            modifiedUser.vorname = vorname;
            modifiedUser.mail = email;
            usersMapped.set(id, modifiedUser);
            res.json({ succeed: true, message: "Benutzer geändert" });
            return;
        }
    }
    res.json({ succeed: false, message: "Ein oder mehrere Felder sind leer" });
});
router.get("/users", function (req, res) {
    res.status(200);
    res.json(Array.from(usersMapped.values()));
});
router.get("/user/:id", function (req, res) {
    res.status(200);
    var id = Number(req.params.id);
    if (id !== undefined && usersMapped.has(id)) {
        res.json({ succeed: true, data: usersMapped.get(id) });
    }
    res.json({ succeed: false, message: "Id nicht korrekt oder Benutzer nicht vorhanden" });
});
