"use strict";

const logger = require("../utils/logger.js");
const accounts = require("../controllers/accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");

const analytics = {

  calculateBMI(loggedInUser) {

    const assessments = assessmentStore.getUserAssessments(loggedInUser.id);
    let weight = 0;

    if (assessments.length > 0) {
     weight = assessments[0].weight;
    } else weight = loggedInUser.startingWeight;

    const height = loggedInUser.height;
   
    return Math.round((weight/(height * height)*100))/100;
  },

  bmiCategory(loggedInUser) {

    const bmi = this.calculateBMI(loggedInUser);

    if(bmi < 15) {
      return "Very Severely Underweight";
    } else if (bmi >= 15 && bmi < 16) {
      return "Severely Underweight";
    } else if (bmi >= 16 && bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      return "Normal";
    } else if (bmi >= 25 && bmi < 30) {
      return "Overweight";
    } else if (bmi >= 30 && bmi < 35) {
      return "Moderately Overweight";
    } else if (bmi >= 35 && bmi < 40) {
      return "Severely Obese";
    } else if (bmi >= 40) {
      return "Very Severely Obese";
    }
  },

};

module.exports = analytics;