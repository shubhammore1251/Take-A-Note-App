const { db } = require("../firebase/firebase");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return next(new ErrorHandler("Unauthorized access Please login!", 401));
  }
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedData.id;
    
    // ✅ Fetch user document by ID:
    const docRef = db.collection("users").doc(userId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = { id: userId, ...docSnap.data() };
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or Expired token", 401));
  }
});