"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const userStore = require("../models/user-store");
const assessmentStore = require("../models/assessment-store");

const trainerDashboard = {
  index(request, response) {
    logger.info("rendering trainer dashboard");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const members = userStore.getAllUsers();

    // determine the assessment count for each member in the gym
    for (let i = 0; i < members.length; i++) {
      const userid = members[i].id;
      const assessments = assessmentStore.getUserAssessments(userid);
      members[i].assessmentCount = assessments.length;

    }
    const viewData = {
      title: "Trainer Dashboard",
      trainer: loggedInTrainer,
      members: members,
    };
    response.render("trainerdashboard", viewData);
  },

  deleteMember(request, response) {
    const memberId = request.params.id;
    userStore.removeUser(memberId);
    response.redirect("/trainerdashboard");
  },

};

module.exports = trainerDashboard;