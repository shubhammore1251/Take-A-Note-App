const express = require("express");
const { singUpUser, logoutUser } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/signupuser").post(singUpUser);

router.route("/logout").post(isAuthenticatedUser, logoutUser);
module.exports = router;
