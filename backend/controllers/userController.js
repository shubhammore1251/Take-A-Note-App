const { db, admin } = require("../firebase/firebase");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const isProd = process.env.NODE_ENV === "PRODUCTION";

exports.singUpUser = catchAsyncErrors(async (req, res, next) => {
  const { photoURL, name, email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const usersRef = db.collection("users");

  // Step 1: Check for existing user by email
  const querySnap = await usersRef.where("email", "==", email).limit(1).get();

  let userId;
  let twoFAenabled = false;

  if (querySnap.empty) {
    // Step 2: Create new user with generated ID
    userId = uuidv4();
    await usersRef.doc(userId).set({
      id: userId,
      name: name || "",
      email,
      photoURL: photoURL || "",
      two_fa_secret: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    // Step 3: User exists — reuse ID
    const docSnap = querySnap.docs[0];
    // console.log(docSnap.id, docSnap.get('two_fa_secret'))
    userId = docSnap.get("id");
    twoFAenabled = docSnap.get('two_fa_secret') ? true : false;
  }

  const token = await jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  res.status(200).json({
    success: true,
    data: {
      userId: userId,
      multiFactorEnabled: twoFAenabled,
      verificationToken: token,
    },
  });

  next();
});

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: "Strict", // match your original sameSite value
    path: "/", // ensure same path
  });

  // Send response or redirect
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
