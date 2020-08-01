"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const memberdashboard = require("./controllers/memberdashboard.js");
const analytics = require("./utils/analytics");

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.get("/memberdashboard", memberdashboard.index);

router.post("/memberdashboard/addassessment", memberdashboard.addAssessment);
router.get("/memberdashboard/removeassessment/:id", memberdashboard.removeAssessment);

module.exports = router;