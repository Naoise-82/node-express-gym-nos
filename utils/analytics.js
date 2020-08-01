"use strict";

const logger = require("../utils/logger.js");
const accounts = require("../controllers/accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");

const analytics = {

  calculateBMI(request) {
    const user = accounts.getCurrentUser(request);
    const weight = user.startingWeight;
    const height = user.height;
   
    return Math.round((weight/(height * height)*100))/100;
    //return 75/(1.8*1.8);

  }
};

module.exports = analytics;