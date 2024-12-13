const { getTheCountOfAll, getTheCountOfAllArbitrator } = require("./count.controller")

const globalCount = require("express").Router()

globalCount.get("/counts",getTheCountOfAll)

globalCount.get("/arbitrator/counts",getTheCountOfAllArbitrator)

module.exports = {globalCount}