const {
  getTheCountOfAll,
  getTheCountOfAllArbitrator,
  getTheCountOfAllClient,
} = require("./count.controller");

const globalCount = require("express").Router();

globalCount.get("/counts", getTheCountOfAll);

globalCount.get("/arbitrator/counts", getTheCountOfAllArbitrator);

globalCount.get("/client/counts", getTheCountOfAllClient);


module.exports = { globalCount };
