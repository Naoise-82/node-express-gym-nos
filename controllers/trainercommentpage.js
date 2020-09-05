"use strict";

const accounts = require("./accounts");
const assessmentStore = require("../models/assessment-store");
const logger = require("../utils/logger");
const userStore = require("../models/user-store");
const goalStore = require("../models/goals-store");
const uuid = require("uuid");

const trainerCommentPage = {
  index(request, response) {
    
    logger.info("rendering trainer comment page");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const memberId = request.params.id;
    const assessments = assessmentStore.getUserAssessments(memberId);

    const viewData = {
      title: "Trainer Comment Page",
      trainer: loggedInTrainer,
      member: userStore.getUserById(memberId),
      assessments: assessments,
    };
    response.render("trainercommentpage", viewData);
  },

  addComment(request, response) {
    const assessmentId = request.params.id;
    const assessment = assessmentStore.getAssessment(assessmentId);
    const memberId = assessment.userid;
    const comment = request.body.comment;

    logger.info("Adding comment: " + comment);
    assessmentStore.setComment(assessmentId, comment);
    response.redirect("/trainercommentpage/" + memberId);
  },

  trainerAddGoal(request, response) {
    const memberId = request.params.id;

    // validate the data to make sure that the required fields are filled
    if (request.body.date === "" || request.body.goalWeight <= 0 ||
      (request.body.additionalTarget === "" && request.body.additionalTargetValue !== "") ||
      (request.body.additionalTarget !== "" && request.body.additionalTargetValue === "")) {
      response.redirect("/trainercommentpage/");
    } else {
        // set the additional target fields to N/A and None in the case that they are not being used
        let additionalTargetValue = "N/A";
        let additionalTarget = "None";
        if(request.body.additionalTargetValue > 0) {
          additionalTarget = request.body.additionalTarget;
          additionalTargetValue = Number(request.body.additionalTargetValue);
        }
      const goal = {
        id: uuid.v1(),
        userid: memberId,
        date: request.body.date,
        targetWeight: Number(request.body.goalWeight),
        additionalTarget: request.body.additionalTarget,
        additionalTargetValue: Number(request.body.additionalTargetValue),
        status: "Open"
      };
      goalStore.addGoal(goal);
      response.redirect("/trainercommentpage/" + memberId);
    }
  }
};

module.exports = trainerCommentPage;