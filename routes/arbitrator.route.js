const {
  allArbitrators,
  updateArbitrators,
} = require("../controllers/arbitrator.controller");

const arbitratorRoute = require("express").Router();

arbitratorRoute.get("/all", allArbitrators);

arbitratorRoute.put("/update/:id", updateArbitrators);

module.exports = { arbitratorRoute };
