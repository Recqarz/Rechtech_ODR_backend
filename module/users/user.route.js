const {
  handleAuthSignup,
  handleAuthLogin,
} = require("./user.controller");

const userRoute = require("express").Router();

userRoute.post("/register", handleAuthSignup);

userRoute.post("/login", handleAuthLogin);

module.exports = { userRoute };
