const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hash(value) {
  const salt = bcrypt.genSaltSync(parseInt(process.env.HASH_SALT_ROUNDS));
  return bcrypt.hashSync(value, salt);
}

function isMatch(data, hashedData) {
  return bcrypt.compareSync(data, hashedData);
}

function decodeToken(token) {
  return jwt.decode(token, process.env.API_SECRET);
}

function isTokenExpired(token, orTokenIsNull = false) {
  if (token == null && orTokenIsNull === true) return true;
  const decoded = decodeToken(token);
  const expirationTimestamp = decoded.exp * 1000; // Convert to milliseconds
  return Date.now() >= expirationTimestamp;
}

// HS256 by default
async function createToken(payload, { expiresIn, ...otherOptions }) {
  return await jwt.sign(payload, process.env.API_SECRET, {
    expiresIn,
    ...otherOptions,
  });
}

async function createAccessToken({ username, email, role }) {
  return await createToken(
    { username, email, role },
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION + "s" }
  );
}

async function createRefreshToken({ username, email, role }) {
  return await createToken(
    { username, email, role },
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION + "s" }
  );
}

async function generateTokens({ username, email, role }) {
  const accessToken = await createAccessToken({ username, email, role });
  const refreshToken = await createRefreshToken({ username, email, role });
  return { accessToken, refreshToken };
}

async function sameUserToken(decodedAccessToken, decodedRefreshToken) {
  const fields = ["username", "email", "role"];
  return fields.every(
    (field) => decodedAccessToken[field] === decodedRefreshToken[field]
  );
}

module.exports.hash = hash;
module.exports.isMatch = isMatch;
module.exports.decodeToken = decodeToken;
module.exports.isTokenExpired = isTokenExpired;
module.exports.createToken = createToken;
module.exports.createAccessToken = createAccessToken;
module.exports.createRefreshToken = createRefreshToken;
module.exports.generateTokens = generateTokens;
module.exports.sameUserToken = sameUserToken;
