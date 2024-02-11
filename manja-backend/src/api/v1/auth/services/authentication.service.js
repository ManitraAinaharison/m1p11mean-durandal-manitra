const User = require("../schemas/user.schema").User;
const ROLES = require("../schemas/user.schema").ROLES;
const mongoose = require("mongoose");
const securityUtil = require("../../../../util/security.util");
const apiUtil = require("../../../../util/api.util");

const bcrypt = require("bcrypt");

module.exports.register = async function register(req) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let { firstname, lastname, username, password, email } = req.body;
    await User.deleteMany()
    let newUser = new User({
      firstname,
      lastname,
      username,
      password,
      email,
      role: ROLES.CUSTOMER,
    });

    newUser = await newUser.save({ session });
    username = newUser.username;
    email = newUser.email;
    role = newUser.role;
    const { accessToken, refreshToken } = await securityUtil.generateTokens({
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
    let { email, password } = req.body;
    if (!email || !password)
      throw apiUtil.ErrorWithStatusCode("Email ou mot de passe manquant", 400);
    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !securityUtil.isMatch(password, user.password))
      throw apiUtil.ErrorWithStatusCode("Email ou mot de passe invalide", 401);
    const username = user.username;
    const role = user.role;
    const { accessToken, refreshToken } = await securityUtil.generateTokens({
      username,
      email,
      role,
    });
    return {
      accessToken,
      refreshToken,
      responseBody: apiUtil.successResponse(true, { username, email, role }),
    };
  } catch (e) {
    throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
  }
};

module.exports.currentUser = async function currentUser(req) {

};

module.exports.listUsers = async function register() {
  return await User.find();
};
