const { db, admin } = require("../firebase/firebase");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const getJwtToken = require("../utils/getJwtToken");
const { v4: uuidv4 } = require("uuid");

exports.singUpUser = catchAsyncErrors(async (req, res, next) => {
  const { photoURL, name, email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required"));
  }

  const usersRef = db.collection("users");

  // Step 1: Check for existing user by email
  const querySnap = await usersRef.where("email", "==", email).limit(1).get();

  let userId;
  if (querySnap.empty) {
    // Step 2: Create new user with generated ID
    userId = uuidv4();
    await usersRef.doc(userId).set({
      id: userId,
      name: name || "",
      email,
      photoURL: photoURL || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    // Step 3: User exists — reuse ID
    const docSnap = querySnap.docs[0];
    userId = docSnap.id;
  }

  // Generate JWT token using the userId
  const token = await getJwtToken(userId);

  // Set cookie with HttpOnly and Secure flags
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.status(200).json({
    success: true,
    token,
  });
});

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "Strict", // match your original sameSite value
    path: "/", // ensure same path
  });

  // Send response or redirect
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
