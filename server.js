"use strict";

const express = require("express");
const logger = require("./utils/logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const assessmentStore = require("./models/assessment-store");
const accounts = require("./controllers/accounts");

const app = express();
app.use(cookieParser());
const exphbs = require("express-handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {

      // assess the status of a goal to determine whether it is still open, achieved or missed
      checkGoalStatus(goal, request) {
        const assessments = assessmentStore.getUserAssessments(goal.userid);
        let displayStatus = "";

        // create a date object called "timestamp" with the current date and time
        const timestamp = new Date();

        //take the relevant data from the timestamp to compile short string to match the date format in the goals-store
        const currentDate = timestamp.getFullYear()-2000 + "/"
          + (timestamp.getMonth()+1) + "/" // add a leading 0 & shorten to two characters (if needed)
          + ("0" + timestamp.getDate()).slice(-2);

        // determine the additional target value to be compared to from the assessment
        let additionalTarget = goal.additionalTarget;
        let assessmentValue = 0;

        if (additionalTarget === "Chest") {
          assessmentValue = assessments[0].chest;
        } else if (additionalTarget === "Thigh") {
          assessmentValue = assessments[0].thigh;
        } else if (additionalTarget === "Upper Arm") {
          assessmentValue = assessments[0].upperarm;
        } else if (additionalTarget === "Waist") {
          assessmentValue = assessments[0].waist;
        } else if (additionalTarget === "Hips") {
          assessmentValue = assessments[0].hips;
        }

        // determine the status of the goal by comparing the goal values to the latest assessment values
        if (goal.status === "Achieved") {
          displayStatus = "Achieved"

        } else if (currentDate <= goal.date && assessments[0].weight <= goal.targetWeight &&
                  (additionalTarget === "" || goal.additionalTargetValue <= assessmentValue)) {
          goal.status = "Achieved";
          displayStatus = "Achieved";

        } else if (currentDate <= goal.date && assessments[0].weight > goal.targetWeight &&
                  (additionalTarget === "" || goal.additionalTargetValue > assessmentValue)) {
          displayStatus = "Open";

        } else displayStatus = "Missed";
        goal.status = "Missed";
        return displayStatus;
      }
    }
  })
);
app.set("view engine", ".hbs");

const routes = require("./routes");
app.use("/", routes);

const listener = app.listen(process.env.PORT || 4000, function() {
  logger.info(`glitch-template-1 started on port ${listener.address().port}`);
});