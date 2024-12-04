const { caseRoute } = require("../module/cases/case.route");
const { globalCount } = require("../module/global/count/count.route");
const { userRoute } = require("../module/users/user.route");
const webexRouter = require("../module/webex/webex.route");
const { arbitratorRoute } = require("../routes/arbitrator.route");
const { appointAllRoute } = require("../routes/arbitratorassandnotify.route");
const { clientRoute } = require("../routes/client.route");
const { expertRoute } = require("../routes/expert.route");
const { resetPasswordRoute } = require("../routes/resetpassword.route");
const { uidRoute } = require("../routes/uid.route");

const allRoutes = require("express").Router();

allRoutes.use("/auth", userRoute);
allRoutes.use("/resetpassword", resetPasswordRoute);
allRoutes.use("/arbitrator", arbitratorRoute);
allRoutes.use("/client", clientRoute);
allRoutes.use("/autouid", uidRoute);
allRoutes.use("/cases", caseRoute);
allRoutes.use("/experties", expertRoute);
allRoutes.use("/arbitratorappointandnotifyall", appointAllRoute);
allRoutes.use("/webex", webexRouter);
allRoutes.use("/global", globalCount);

module.exports = { allRoutes };
