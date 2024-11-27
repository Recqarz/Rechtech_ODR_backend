const { userExists, verifyOtp, updatepassword } = require("../controllers/resetpassword.controller");

const resetPasswordRoute = require("express").Router();

resetPasswordRoute.post("/userexists", userExists);

resetPasswordRoute.post("/verifyotp", verifyOtp);

resetPasswordRoute.put("/updatepassword", updatepassword);

module.exports = { resetPasswordRoute };
