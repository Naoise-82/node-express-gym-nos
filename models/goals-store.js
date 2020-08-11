"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const goalsStore = {
  store: new JsonStore("./models/goals-store.json", {
    goals: []
  }),
  collection: "goals",

  getUserGoals(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },

  getGoal(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  addGoal(goal) {
    this.store.add(this.collection, goal);
    this.store.save();
  },
}

module.exports = goalsStore;