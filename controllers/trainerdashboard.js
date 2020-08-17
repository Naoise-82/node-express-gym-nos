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
    //let assessmentCounts = [];

    for (let i = 0; i < members.length; i++) {
      const userid = members[i].id;
      const assessments = assessmentStore.getUserAssessments(userid);
      members[i].assessmentCount = assessments.length;
      //userStore.updateUser();
    }
    const viewData = {
      title: "Trainer Dashboard",
      trainer: loggedInTrainer,
      members: members,
      //assessmentCounts: assessmentCounts,
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