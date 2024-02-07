const User = require("../schemas/user.schema").User;
const ROLES = require("../schemas/user.schema").ROLES;
const mongoose = require("mongoose");
const seecurityUtil = require("../../../../util/security.util");

module.exports.register = async function register(req) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { firstname, lastname, username, password, email, role } = req.body;
    let newUser = await User.create({
      firstname,
      lastname,
      username,
      password,
      email: email.toLowerCase(),
      role: ROLES.USER,
    });

    newUser = await newUser.save({ session });
    const { accessToken, refreshToken } = securityUtil.generateTokens({
      username,
      email,
      role,
    });
    await session.commitTransaction();
    return {
      accessToken,
      refreshToken,
      responseBody: { username, email, role },
    };
  } catch (e) {
    await session.abortTransaction();
    console.log(e);
    throw new Error("Veuillez réessayer s'il vous plaît");
  } finally {
    await session.endSession();
  }
};

module.exports.login = async function login(req) {
  try {
    const { email, password } = req.body;
    const user = User.findOne({
      email,
      password: seecurityUtil.hash(password),
    });
    if (!user) return null;
    const { accessToken, refreshToken } = securityUtil.generateTokens({
      username,
      email,
      role: user.role,
    });
    return {
      accessToken,
      refreshToken,
      responseBody: { username, email, role },
    };
  } catch (e) {
    console.log(e);
    throw new Exception(e.message);
  }
};

module.exports.listUsers = async function register() {
  return await User.find();
};
