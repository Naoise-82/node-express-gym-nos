"use strict";

const logger = require("../utils/logger.js");
const accounts = require("../controllers/accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");

const analytics = {

  calculateBMI(loggedInUser) {

    const assessments = assessmentStore.getUserAssessments(loggedInUser.id);

    const weight = assessments[0].weight;
    const height = loggedInUser.height;
   
    return Math.round((weight/(height * height)*100))/100;
  }
};

module.exports = analytics;