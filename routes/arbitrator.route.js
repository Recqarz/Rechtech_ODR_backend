const {
  allArbitrators,
  updateArbitrators,
  getArbitratorStatus,
} = require("../controllers/arbitrator.controller");

const arbitratorRoute = require("express").Router();

arbitratorRoute.get("/all", allArbitrators);

arbitratorRoute.get("/getArbitratorStatus", getArbitratorStatus);

arbitratorRoute.put("/update/:id", updateArbitrators);

module.exports = { arbitratorRoute };
