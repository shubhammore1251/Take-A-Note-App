const bcrypt = require("bcryptjs");
const generateBcryptHash = async (str) => {
  try {
    const hash = await bcrypt.hash(str, Number(process.env.SALT_ROUNDS));
    return hash;
  } catch (error) {
    console.log("Error generating hash:", error);
    throw error;
  }
};

const compareBcryptHashes = async (str, hash) => {
  try {
    const matches = await bcrypt.compare(str, hash);
    return matches;
  } catch (error) {
    console.log("Error comparing hashes:", error);
    throw error;
  }
};

module.exports = { generateBcryptHash, compareBcryptHashes };
