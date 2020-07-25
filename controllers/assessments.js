"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const assessmentStore = require("../models/assessment-store");

const assessments = {
  index(request, response) {
    const assessmentCollectionId = request.params.id;
    logger.info("Assessment Collection Id = " + assessmentCollectionId);
    const viewdata = {
      title: "User Assessments",
      assessmentList: assessmentStore.getUserAssessments(assessmentCollectionId)
    };
    response.render("assessmentCollection", viewdata);
  }
};

module.exports = assessments;
