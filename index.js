require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db.connection");
const { resetPasswordRoute } = require("./routes/resetpassword.route");
const { arbitratorRoute } = require("./routes/arbitrator.route");
const { clientRoute } = require("./routes/client.route");
const { uidRoute } = require("./routes/uid.route");
// const { caseDataRoute } = require("./routes/caseData.route");
const { expertRoute } = require("./routes/expert.route");
const { appointAllRoute } = require("./routes/arbitratorassandnotify.route");
// const { meetingRoute } = require("./routes/meeting.route");
const { caseRoute } = require("./module/cases/case.route");
const webexRouter = require("./module/webex/webex.route");
const { userRoute } = require("./module/users/user.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/", (req, res) => {
  res.json({ message: "Server health is good" });
});
app.use("/api/auth", userRoute);
app.use("/api/resetpassword", resetPasswordRoute);
app.use("/api/arbitrator", arbitratorRoute);
app.use("/api/client", clientRoute);
app.use("/api/autouid", uidRoute);
app.use("/api/cases", caseRoute);
app.use("/api/experties", expertRoute);
app.use("/api/arbitratorappointandnotifyall", appointAllRoute);
// app.us/apie("/meeting", meetingRoute);
app.use("/api/webex", webexRouter);

const port = process.env.PORT;

app.listen(port, async () => {
  console.log(`server is running on port ${port}`);
  await connection;
  console.log("db connected");
});
