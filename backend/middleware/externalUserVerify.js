const { compareBcryptHashes } = require("../utils/bycrypt");
const ErrorHandler = require("../utils/errorHandler");

exports.verifyExternalUser = async (req, res, next) => {
  try {
    const cryptvalue = req.headers['x-crypt-value'];

    if (!cryptvalue) {
      return next(new ErrorHandler("Not Allowed to access this resource", 400));
    }

    const secretValue = process.env.CRYPT_SECRET_STR_VALUE;

    const matches = await compareBcryptHashes(secretValue, cryptvalue);
    
    if (!matches) {
      return next(new ErrorHandler("Access Denied", 401));
    }

    // If authentication passes, call the handler.
    next();
  } catch (error) {
    console.log("verifyExternalUser Middleware error:", error);
    next(error);
  }
};
