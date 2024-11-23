const { appointArbitratorandNotify } = require("../controllers/arbitratorassandnotify.controller")

const appointAllRoute = require("express").Router()

appointAllRoute.post("/", appointArbitratorandNotify)

module.exports = { appointAllRoute }