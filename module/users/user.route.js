const {
  handleAuthSignup,
  handleAuthLogin,
  respondentOTP,
  respondentLogin,
} = require("./user.controller");

const userRoute = require("express").Router();

userRoute.post("/register", handleAuthSignup);

userRoute.post("/login", handleAuthLogin);
userRoute.post("/respondentotp", respondentOTP);
userRoute.post("/respondentlogin", respondentLogin);

module.exports = { userRoute };
