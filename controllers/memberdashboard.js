"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");

const memberDashboard = {
  index(request, response) {
    logger.info("rendering member dashboard");
    const loggedInUser = accounts.getCurrentUser(request);
    logger.info("Current user = " + loggedInUser.firstName);
    const viewData = {
      title: "Member Dashboard",
      assessments: assessmentStore.getUserAssessments(loggedInUser.id),
      //assessments: assessmentStore.getAllAssessments()
      loggedInUser: loggedInUser
    };
    response.render("memberdashboard", viewData);
  }
};

module.exports = memberDashboard;