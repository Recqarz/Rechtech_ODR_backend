const {
  appointArbitratorandNotify,
  appointArbitratorandNotifyBulk,
  appointArbitratorandForPendingCasesNotifyBulk
} = require("../controllers/arbitratorassandnotify.controller");

const appointAllRoute = require("express").Router();

appointAllRoute.post("/", appointArbitratorandNotify);

//assign arbitrator for pending cases
appointAllRoute.post("/bulk", appointArbitratorandNotifyBulk);

//assign arbitrator randomly for pending cases after 10 days
appointAllRoute.post("/bulk/pendingcases", appointArbitratorandForPendingCasesNotifyBulk);

module.exports = { appointAllRoute };
