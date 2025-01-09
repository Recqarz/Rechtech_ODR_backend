const {
  handleAuthSignup,
  handleAuthLogin,
  respondentOTP,
  respondentLogin,
  validateToken,
  handleAuthSignUpOTP,
  handleAuthLoginOTP
} = require("./user.controller");

const userRoute = require("express").Router();

userRoute.post("/register", handleAuthSignup);

userRoute.post("/login", handleAuthLogin);
userRoute.post("/respondentotp", respondentOTP);
userRoute.post("/respondentlogin", respondentLogin);
userRoute.get("/validatetoken", validateToken);

userRoute.post("/register/otp", handleAuthSignUpOTP);
userRoute.post("/login/otp", handleAuthLoginOTP);

module.exports = { userRoute };
