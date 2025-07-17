const express = require("express");
const { setUp2FA, verify2FA, verifyMFAJWTToken } = require("../controllers/twoFactorController");
const { verifyExternalUser } = require("../middleware/externalUserVerify");

const router = express.Router();

router.route('/2fa/register').post(verifyExternalUser, setUp2FA);

router.route('/2fa/verify-totp').post(verifyExternalUser, verify2FA);

router.route('/2fa/verify-mfa-token').post(verifyExternalUser, verifyMFAJWTToken);

module.exports = router;