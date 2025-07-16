const express = require("express");
const { setUp2FA, verify2FA, verifyMFAJWTToken, check2FAVerified } = require("../controllers/twoFactorController");

const router = express.Router();

router.route('/2fa/register').post(setUp2FA);

router.route('/2fa/verify-totp').post(verify2FA);

router.route('/2fa/verify-mfa-token').post(verifyMFAJWTToken);

module.exports = router;