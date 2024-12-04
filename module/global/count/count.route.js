const { getTheCountOfAll } = require("./count.controller")

const globalCount = require("express").Router()

globalCount.get("/counts",getTheCountOfAll)

module.exports = {globalCount}