"use strict";

const userStore = require("../models/user-store");
const trainerStore = require("../models/trainer-store");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {

  index(request, response) {
    const viewData = {
      title: "Login or Signup"
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("login", viewData);
  },

  trainerLogin(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("trainerLogin", viewData);
  },

  logout(request, response) {
    response.cookie("playwebgym", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid.v1();
    userStore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    const user = userStore.getUserByEmail(request.body.email);
    if (request.body.password === user.password) {
      response.cookie("playwebgym", user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect("/memberdashboard");
    } else {
      response.redirect("/login");
    }
  },

  trainerAuthenticate(request, response) {
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
    if (request.body.password === trainer.password) {
      response.cookie("playwebgym", trainer.email);
      logger.info(`logging in ${trainer.email}`);
      response.redirect("/trainerdashboard");
    } else {
      response.redirect("/trainerlogin");
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.playwebgym;
    return userStore.getUserByEmail(userEmail);
  },

  getCurrentTrainer(request) {
    const trainerEmail = request.cookies.playwebgym;
    return trainerStore.getTrainerByEmail(trainerEmail);
  }

};

module.exports = accounts;
