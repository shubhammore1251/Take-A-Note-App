const QRCode = require("qrcode");
const speakeasy = require("speakeasy");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { db, admin } = require("../firebase/firebase");
const getJwtToken = require("../utils/getJwtToken");
const jwt = require("jsonwebtoken");

const isProd = process.env.NODE_ENV === "PRODUCTION";



exports.setUp2FA = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("User Id not provided!", 400));
  }

  const secret = speakeasy.generateSecret({
    name: `Take-A-Note: ${email}`,
  });

  console.log("Generated Secret (Base32):", secret.base32);
  console.log("Generated Secret (otpauth_url):", secret.otpauth_url);

  const usersRef = db.collection("users");
  const querySnap = await usersRef.where("email", "==", email).limit(1).get();

  if (querySnap.empty) {
    return next(new ErrorHandler("User not found", 404));
  }

  // There should be just one match
  const doc = querySnap.docs[0];
  const docRef = usersRef.doc(doc.id);

  await docRef.update({
    two_fa_secret: secret.base32,
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  return res.status(201).json({
    success: true,
    data: {
      qrCode,
      otpauth_url: secret.otpauth_url,
    },
    message: "Register 2FA intiated!",
  });
});

exports.verify2FA = catchAsyncErrors(async (req, res, next) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return next(new ErrorHandler("Email or code is required", 400));
  }

  const usersRef = db.collection("users");
  const querySnap = await usersRef.where("email", "==", email).limit(1).get();

  if (querySnap.empty) {
    return next(new ErrorHandler("User not found", 404));
  }

  // There should be just one match
  const doc = querySnap.docs[0];

  const secret = doc.get("two_fa_secret");

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token.trim(),
    window: 1,
  });

  if (Boolean(verified) === true) {
    console.log("Verified");

    await usersRef.doc(doc.id).update({
      is_two_fa_verified: true,
      two_fa_verified_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    const token = await getJwtToken(doc.get("id"));
    
    console.log("isProd >>>", isProd);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      mesage: "2FA verification successfull!",
    });
  } else {
    return res.status(401).json({
      success: false,
      error: "Invalid code",
    });
  }
});

exports.verifyMFAJWTToken = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new ErrorHandler("Token is required", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      data: {
        email: decoded?.email,
      },
    });
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});
