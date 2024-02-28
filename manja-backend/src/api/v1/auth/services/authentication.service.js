const mongoose = require("mongoose");
const securityUtil = require("../../../../util/security.util");
const apiUtil = require("../../../../util/api.util");

const { User, Customer } = require("../schemas/user.schema");

module.exports.register = async function register(req) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let { firstname, lastname, username, password, email } = req.body;
        let newUser = new Customer({
            firstname,
            lastname,
            username,
            password,
            email
        });

        newUser = await newUser.save({ session });
        const { accessToken, refreshToken } = await securityUtil.generateTokens(newUser);
        await session.commitTransaction();
        const { password: pwd, __t, __v, _id, ...user } = newUser._doc;
        return {
            accessToken,
            refreshToken,
            responseBody: apiUtil.successResponse(true, user),
        };
    } catch (e) {
        await session.abortTransaction();
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    } finally {
        await session.endSession();
    }
};

module.exports.login = async function login(req, roles) {
    try {
        let { email, password } = req.body;

        if (!email || !password)
            throw apiUtil.ErrorWithStatusCode("Email ou mot de passe manquant", 400);

        email = email.toLowerCase();

        let user = await User.findOne({ 
            email: email, 
            $or: roles.map((role) => {
                return { role: role };
            })  
        });

        if (!user || !securityUtil.isMatch(password, user.password))
            throw apiUtil.ErrorWithStatusCode("Email ou mot de passe invalide", 401);

        const { accessToken, refreshToken } = await securityUtil.generateTokens(user);
        const { password: pwd, __t, __v, _id, ...newUser } = user._doc;
        return {
            accessToken,
            refreshToken,
            responseBody: apiUtil.successResponse(true, newUser),
        };
    } catch (e) {
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};