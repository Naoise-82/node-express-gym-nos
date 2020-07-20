"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const memberdashboard = require("./controllers/memberdashboard.js")

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.get("/memberdashboard", memberdashboard.index);
module.exports = router;