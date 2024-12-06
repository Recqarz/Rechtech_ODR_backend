const {
  handleAuthSignup,
  handleAuthLogin,
  respondentOTP,
  respondentLogin,
  validateToken,
} = require("./user.controller");

const userRoute = require("express").Router();

userRoute.post("/register", handleAuthSignup);

userRoute.post("/login", handleAuthLogin);
userRoute.post("/respondentotp", respondentOTP);
userRoute.post("/respondentlogin", respondentLogin);
userRoute.get("/validatetoken", validateToken);

module.exports = { userRoute };
