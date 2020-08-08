"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const userStore = require("../models/user-store");

const updateDetails = {
  index(request, response) {
    logger.info("Rendering Update Details Page");
    const loggedInUser = accounts.getCurrentUser(request);

    const viewData = {
      title: "Update Details",
      user: loggedInUser
    }
    response.render("updatedetails", viewData);
  },

  updateMember(request, response) {
    const user = accounts.getCurrentUser(request);
    logger.info("User: " + user.firstName);

    user.firstName = request.body.firstName;
    user.lastName = request.body.lastName;
    user.gender = request.body.gender;
    user.email = request.body.email;
    user.password = request.body.password;

    userStore.updateUser();
    response.redirect("/login");
  },
};

module.exports = updateDetails;