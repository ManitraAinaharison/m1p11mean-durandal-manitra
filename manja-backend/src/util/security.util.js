const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.hash = function hash(value) {
  return bcrypt.hashSync(value);
};

module.exports.decodeToken = function decodeToken(value){
    return jwt.decode(token);
}

module.exports.isTokenExpired = function isTokenExpired(token) {
    const decoded = decodeToken(token); // Decoded payload (no verification)
    console.log('expiration Timestamp : ', decoded.exp);
    const expirationTimestamp = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTimestamp;
};

// HS256 by default
module.exports.createToken = async function createToken(payload, { expiresIn, ...otherOptions }) {
  return jwt.sign(payload, process.env.API_SECRET, {
    expiresIn,
    ...otherOptions,
  });
}

module.exports.createAccessToken = async function createAccessToken({ username, email, role }) {
  return createToken(
    { username, email, role },
    { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10) }
  );
}

module.exports.createRefreshToken = async function createRefreshToken({ username, email, role }) {
  return createToken(
    { username, email, role },
    { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRATION, 10) }
  );
}

module.exports.generateTokens = async function generateTokens({ username, email, role }) {
  const accessToken = createAccessToken({ username, email, role });
  const refreshToken = createRefreshToken({ username, email, role });
  return { accessToken, refreshToken };
}
