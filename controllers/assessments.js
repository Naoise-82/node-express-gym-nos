"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const assessmentStore = require("../models/assessment-store");

const assessments = {
  index(request, response) {
    const assessmentCollectionId = request.params.id;
    logger.info("AssessmentCollctionId = " + assessmentCollectionId);
    const viewdata = {
      title: "User Dashboard",
      assessments: assessmentStore.getUserAssessments(assessmentCollectionId)
    };
    response.render("AssessmentCollection", viewdata);
  }
};

module.exports = assessments;
