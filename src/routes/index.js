const express = require("express");
const router = express.Router();
const path = require("path");

const views = path.join(__dirname, "/../views");

router.get("/login.htm", (req, res) => {
    res.sendFile(views + "/mobile-index.html");
});

router.get("/login.htm/clasico", (req, res) => {
    res.sendFile(views + "/index.html");
});

router.get("/adm", (req, res) => {
    res.sendFile(views + "/adm.html")
});

router.get("/home.htm", (req, res) => {
    res.sendFile(views + "/home.html")
});

router.get("/m/faces/pages/inicio.xhtml", (req, res) => {
    res.sendFile(views + "/mobile-home.html")
});

module.exports = router;