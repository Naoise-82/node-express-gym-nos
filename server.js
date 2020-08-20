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
        //const member = accounts.getCurrentUser(request);
        const assessments = assessmentStore.getUserAssessments(goal.userid);
        let status = "";

        const targetArea1 = goal.targetArea1.toLowerCase();

        // create a date object called "timestamp" with the current date and time
        const timestamp = new Date();

        //take the relevant data from the timestamp to compile short string to match the date format in the goals-store
        const currentDate = timestamp.getFullYear()-2000 + "/"
          + (timestamp.getMonth()+1) + "/" // add a leading 0 & shorten to two characters (if needed)
          + ("0" + timestamp.getDate()).slice(-2);

        logger.info("Current Date: " + currentDate);

        if(currentDate <= goal.date && assessments[0].weight <= goal.targetMeasurement1) {
          status = "Achieved";
        } else status = "Missed";
        return status;
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