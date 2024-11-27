const {
  appointArbitratorandNotify,
  appointArbitratorandNotifyBulk,
} = require("../controllers/arbitratorassandnotify.controller");

const appointAllRoute = require("express").Router();

appointAllRoute.post("/", appointArbitratorandNotify);

appointAllRoute.post("/bulk", appointArbitratorandNotifyBulk);

module.exports = { appointAllRoute };
