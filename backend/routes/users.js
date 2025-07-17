const express = require("express");
const { singUpUser, logoutUser } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
const { notifyUser } = require("../middleware/notifyUser");
const { verifyExternalUser } = require("../middleware/externalUserVerify");

const router = express.Router();

router.route("/signupuser").post(verifyExternalUser, singUpUser, notifyUser);

router.route("/logout").post(isAuthenticatedUser, logoutUser);

router.route("/check-session").get(isAuthenticatedUser, (req, res) => {
  const twoFAEnabled = Boolean(req.user.two_fa_secret);
  const twoFAVerified = Boolean(req.user.is_two_fa_verified);
  res.status(200).json({
    valid: true,
    twoFAEnabled,
    twoFAVerified,
  });
});

module.exports = router;
