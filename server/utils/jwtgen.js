const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtGenerator = (username) => {
  const payload = {
    user: {
      id: username,
    },
  };
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "2h" });
};

module.exports = jwtGenerator;
