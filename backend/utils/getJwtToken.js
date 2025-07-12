const jwt = require("jsonwebtoken");

const getJwtToken = async (data) => {
    return jwt.sign({ id: data }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
}

module.exports = getJwtToken;