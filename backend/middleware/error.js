const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong JWT
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid Authorization Token, please try to authenticate again with correct credentials`;
    err = new ErrorHandler(message, 401);
  }

  //if JWT Token is Expired
  if (err.name === "TokenExpiredError") {
    const message = `Your Session has expired! Please login !`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
