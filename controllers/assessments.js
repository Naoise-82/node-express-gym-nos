"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const assessmentStore = require("../models/assessment-store");

const assessmentList = {
  index(request, response) {
    const assessmentListId = request.params.id;
    logger.info("AssessmentListId = " + assessmentListId);
    const viewdata = {
      title: "User Dashboard",
      assessmentList: assessmentStore.getUserAssessments(assessmentListId)
    };
    response.render("assessmentList", viewdata);
  }
};

module.exports = assessmentList;
