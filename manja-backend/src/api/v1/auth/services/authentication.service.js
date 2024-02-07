const User = require("../schemas/user.schema").User;
const ROLES = require("../schemas/user.schema").ROLES;
const jwt = require("jsonwebtoken");

// HS256 by default
async function createToken(payload, { expiresIn, ...otherOptions }) {
  return jwt.sign(payload, process.env.API_SECRET, {
    expiresIn,
    ...otherOptions,
  });
}

async function createAccessToken({ username, email, role }) {
  return createToken(
    { username, email, role },
    { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10) }
  );
}

async function createRefreshToken({ username, email, role }) {
  return createToken(
    { username, email, role },
    { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRATION, 10) }
  );
}

async function generateTokens({ username, email, role }) {
  const accessToken = createAccessToken({ username, email, role });
  const refreshToken = createRefreshToken({ username, email, role });
  return { accessToken, refreshToken };
}

module.exports.register = async function register(req) {
  try {
    const { firstname, lastname, username, password, email, role } = req.body;
    let newUser = await User.create({
      firstname,
      lastname,
      username,
      password,
      email : email.toLowerCase(),
      role : ROLES.USER,
    });

    newUser = await newUser.save();
    const { accessToken, refreshToken } = generateTokens({
      username,
      email,
      role,
    });

    return {
      accessToken,
      refreshToken,
      responseBody: { username, email, role },
    };
  } catch (e) {
    console.log(e)
    throw new Error("Veuillez réessayer s'il vous plaît");
  }
};
