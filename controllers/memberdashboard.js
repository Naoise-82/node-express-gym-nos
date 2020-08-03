"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");
const analytics = require("../utils/analytics");

const memberDashboard = {
  index(request, response) {
    logger.info("rendering member dashboard");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Member Dashboard",
      assessments: assessmentStore.getUserAssessments(loggedInUser.id),
      loggedInUser: loggedInUser,
      bmi: analytics.calculateBMI(loggedInUser),
      category: analytics.bmiCategory(loggedInUser),
      idealBodyWeight: analytics.calculateIdealBodyWeight(loggedInUser),
      currentWeight: analytics.getCurrentWeight(loggedInUser),
      weightIndicator: analytics.checkIdealBodyWeight(loggedInUser)
    };
    response.render("memberdashboard", viewData);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);

    // create a date object called "timestamp" with the current date and time
    const timestamp = new Date();

    //take the relevant date and time data from the timestamp and compile short string
    const date = timestamp.getFullYear()-2000 + "/"
    + ("0" + (timestamp.getMonth()+1)).slice(-2) + "/" // add a leading 0 & shorten to two characters (if needed)
    + ("0" + timestamp.getDate()).slice(-2) + " "
    + ("0" + timestamp.getHours()).slice(-2) + ":"
    + ("0" + timestamp.getMinutes()).slice(-2) + ":"
    + ("0" + timestamp.getSeconds()).slice(-2)

    const assessment = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      date: date,
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperarm: request.body.upperarm,
      waist: request.body.waist,
      hips: request.body.hips
    };
    assessmentStore.addAssessment(assessment);
    response.redirect("/memberdashboard");
  },

  removeAssessment(request, response) {
    const assessmentId = request.params.id;
    logger.info(`Removing Assessment ${assessmentId}`);
    assessmentStore.removeAssessment(assessmentId);
    response.redirect("/memberdashboard");
  }

};

module.exports = memberDashboard;