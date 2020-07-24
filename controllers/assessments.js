"use strict";

const logger = require("../utils/logger");
const uuid = require("uuid");
const assessmentStore = require("../models/assessment-store.js");

const assessmentCollection = {
  index(request, response) {
    const assessmentCollectionId = request.params.id;
    logger.info("AssessmentCollctionId = " + assessmentCollect)
  }
}