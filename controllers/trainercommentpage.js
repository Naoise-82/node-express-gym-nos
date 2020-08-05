"use strict";

const accounts = require("./accounts");
const assessmentStore = require("../models/assessment-store");
const logger = require("../utils/logger");
const userStore = require("../models/user-store");

const trainerCommentPage = {
  index(request, response) {
    logger.info("rendering trainer comment page");
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const memberId = request.params.id;
    const viewData = {
      title: "Trainer Comment Page",
      trainer: loggedInTrainer,
      member: userStore.getUserById(memberId),
      assessments: assessmentStore.getUserAssessments(memberId)
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
  }

};

module.exports = trainerCommentPage;