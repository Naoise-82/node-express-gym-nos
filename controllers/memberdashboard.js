"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");

const memberDashboard = {
  index(request, response) {
    logger.info("rendering member dashboard");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Member Dashboard",
      assessments: assessmentStore.getUserAssessments(loggedInUser.id),
    };
    response.render("memberdashboard", viewData);
  }
}

module.exports = memberDashboard;