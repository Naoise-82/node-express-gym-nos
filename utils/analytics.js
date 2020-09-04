"use strict";

const logger = require("../utils/logger.js");
const assessmentStore = require("../models/assessment-store");
const goalsStore = require("../models/goals-store");
const goalStats = require("../utils/goalstats");
const memberStats = require("../utils/memberstats");
const tolerance = 0.2;

const analytics = {

  generateGoalStats(loggedInUser) {
    const goals = goalsStore.getUserGoals(loggedInUser.id);

    //reset values in goalStats.js
    goalStats.openGoals = 0;
    goalStats.achievedGoals = 0;
    goalStats.missedGoals = 0;

    for (let i = 0; i < goals.length; i++) {
      if (goals[i].status === "Open") {
        goalStats.openGoals += 1;
      }
      if (goals[i].status === "Achieved") {
        goalStats.achievedGoals =+ 1;
      }
      if (goals[i].status === "Missed") {
        goalStats.missedGoals += 1;
      }
    }
    return goalStats;
  },

  generateMemberStats(loggedInUser) {
    const assessments = assessmentStore.getUserAssessments(loggedInUser.id);

    memberStats.weight = this.getCurrentWeight(loggedInUser);
    memberStats.bmi = this.calculateBMI(loggedInUser);
    memberStats.bmiCategory = this.bmiCategory(loggedInUser);
    memberStats.idealBodyWeight = this.calculateIdealBodyWeight(loggedInUser);
    memberStats.isIdealBodyWeight = this.checkIdealBodyWeight(loggedInUser);
    return memberStats;
  },

  getCurrentWeight(loggedInUser) {
    const assessments = assessmentStore.getUserAssessments(loggedInUser.id);
    let currentWeight = 0;
    if (assessments.length > 0) {
      currentWeight = assessments[0].weight;
    } else currentWeight = loggedInUser.startingWeight;

    return currentWeight;
  },

  calculateBMI(loggedInUser) {

    const assessments = assessmentStore.getUserAssessments(loggedInUser.id);
    let weight = 0;

    if (assessments.length > 0) {
     weight = assessments[0].weight;
    } else weight = loggedInUser.startingWeight;

    const height = (loggedInUser.height)/100;
   
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

  calculateIdealBodyWeight(loggedInUser) {

    const assessments = assessmentStore.getUserAssessments(loggedInUser.id);
    let weight = 0;

    if (assessments.length > 0) {
      weight = assessments[0].weight;
    } else weight = loggedInUser.startingWeight;

    let idealBodyWeight = 1;

    if (loggedInUser.gender.toLowerCase() === "male") {
      idealBodyWeight = Math.round((50.0 + 0.9 * (loggedInUser.height - 152))*100)/100;
    } else if (loggedInUser.gender.toLowerCase() === "female") {
      idealBodyWeight = Math.round((45.5 + 0.9 * (loggedInUser.height - 152))*100)/100;
    }
    return idealBodyWeight;
  },

  checkIdealBodyWeight(loggedInUser) {
    let weightIndicator = false;

    if (Math.abs(this.getCurrentWeight(loggedInUser) - this.calculateIdealBodyWeight(loggedInUser)) <= tolerance) {
      weightIndicator = true;
    }
    return weightIndicator;
  }

};

module.exports = analytics;