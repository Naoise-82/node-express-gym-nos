"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");
const analytics = require("../utils/analytics");
const goalStore = require("../models/goals-store");

const memberDashboard = {
  index(request, response) {
    logger.info("rendering member dashboard");

    //pull all the relevant member data from the stores and generate their stats
    const loggedInUser = accounts.getCurrentUser(request);
    const stats = analytics.generateMemberStats(loggedInUser);
    const goals = goalStore.getUserGoals(loggedInUser.id);
    const goalStats = analytics.generateGoalStats(loggedInUser);

    const viewData = {
      title: "Member Dashboard",
      loggedInUser: loggedInUser,
      stats: stats,
      assessments: assessmentStore.getUserAssessments(loggedInUser.id),
      goals: goals,
      goalStats: goalStats
    };
    response.render("memberdashboard", viewData);
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const assessments = assessmentStore.getUserAssessments(loggedInUser.id)
    const newWeight = request.body.weight;

    // determine whether the member's weight is trending upwards or downwards
    let weightTrend = true;
    if (assessments.length > 0) {
      weightTrend = (newWeight < assessments[0].weight);
    } else weightTrend = newWeight < loggedInUser.startingWeight;

    // create a date object called "timestamp" with the current date and time
    const timestamp = new Date();

    //take the relevant date and time data from the timestamp and compile short string
    const date = timestamp.getFullYear() - 2000 + "/"
      + ("0" + (timestamp.getMonth() + 1)).slice(-2) + "/" // add a leading 0 & shorten to two characters (if needed)
      + ("0" + timestamp.getDate()).slice(-2) + " "
      + ("0" + timestamp.getHours()).slice(-2) + ":"
      + ("0" + timestamp.getMinutes()).slice(-2) + ":"
      + ("0" + timestamp.getSeconds()).slice(-2)

    const assessment = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      date: date,
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      thigh: Number(request.body.thigh),
      upperarm: Number(request.body.upperarm),
      waist: Number(request.body.waist),
      hips: Number(request.body.hips),
      weightTrend: weightTrend
    };
    assessmentStore.addAssessment(assessment);
    response.redirect("/memberdashboard");
  },


  removeAssessment(request, response) {
    const assessmentId = request.params.id;
    logger.info(`Removing Assessment ${assessmentId}`);
    assessmentStore.removeAssessment(assessmentId);
    response.redirect("/memberdashboard");
  },

  addGoal(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);

    // validate the data to make sure that the required fields are filled
    if (request.body.date === "" || request.body.goalWeight <= 0 ||
      (request.body.additionalTarget === "" && request.body.additionalTargetValue !== "") ||
      (request.body.additionalTarget !== "" && request.body.additionalTargetValue === "")) {
      response.redirect("/memberdashboard");
    } else {
      const goal = {
        id: uuid.v1(),
        userid: loggedInUser.id,
        date: request.body.date,
        targetWeight: Number(request.body.goalWeight),
        additionalTarget: request.body.additionalTarget,
        additionalTargetValue: Number(request.body.additionalTargetValue),
        status: "Open"
      };
      goalStore.addGoal(goal);
      response.redirect("/memberdashboard");
    }
  }

};

module.exports = memberDashboard;