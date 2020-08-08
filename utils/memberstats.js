"use Strict";

const analytics = require("./analytics");
const accounts = require("../controllers/accounts");
const userStore = require("../models/user-store");
const assessmentStore = require("../models/assessment-store");

const memberStats = {
  weight: 0,
  bmi: 0,
  bmiCategory: "",
  idealBodyWeight: 0,
  isIdealBodyWeight: false,
  weightTrend: true
};

module.exports = memberStats;



