const {
  addExperties,
  allExperties,
} = require("../controllers/expert.controller");

const expertRoute = require("express").Router();

expertRoute.post("/", addExperties);
expertRoute.get("/", allExperties);

module.exports = { expertRoute };
