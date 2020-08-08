"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const accounts = require("./accounts.js");
const userStore = require("../models/user-store");
const assessmentStore = require("../models/assessment-store");
const analytics = require("../utils/analytics");

const trainerDashboard = {
  index(request, response) {
    logger.info("rendering trainer dashboard");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const members = userStore.getAllUsers();
    const viewData = {
      title: "Trainer Dashboard",
      trainer: loggedInTrainer,
      members: members
    };
    response.render("trainerdashboard", viewData);
  },





}

module.exports = trainerDashboard;