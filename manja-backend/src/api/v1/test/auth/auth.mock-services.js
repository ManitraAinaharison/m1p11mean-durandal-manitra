const mongoose = require("mongoose");
const authMockDataFile = require("./auth.datafile");
const authMockService = require("./auth.mock-services");
const { Manager, Employee, User } = require("../../auth/schemas/user.schema");
const { axiosInstance } = require("../../../../config/axios.config");
const { Service } = require("../../service/schemas/service.schema");
const { SubService } = require("../../service/schemas/subservice.schema");
const { Appointment } = require("../../service/schemas/appointment.schema");

module.exports.cleanDb = async() => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    User.collection.drop();
    Service.collection.drop();
    SubService.collection.drop();
    Appointment.collection.drop();
  } catch (e) {
    await session.abortTransaction();
    console.log(`error dropping collections : ${e}`);
  } finally {
    await session.endSession();
  }
}

module.exports.register = register = async (
  data = { firstname, lastname, username, password, email }
) => {
  try {
    const res = await axiosInstance.post("/api/products", data);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};


module.exports.postAdmin = postAdmin = async (adminData = {
  firstname,
  lastname,
  username,
  password,
  email,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let newUser = new Manager(adminData);

    newUser = await newUser.save({ session });
    await session.commitTransaction();
    return newUser;
  } catch (e) {
    await session.abortTransaction();
    console.log(`error creating admin : ${e}`);
  } finally {
    await session.endSession();
  }
};

module.exports.postEmployee = postEmployee = async (
  employeeData = [{
    firstname,
    lastname,
    username,
    password,
    email,
  }]
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let newUsers = await Employee.create(employeeData);

    await session.commitTransaction();
    return newUsers;
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

module.exports.postUser =  postUser = async (userData) => {
  try {
    return await axiosInstance.post("/register", userData);
  } catch (error) {
    throw new Error(`Cannot insert user : ${error}`);
  }
};

module.exports.login =  login = async (loginData = { email, password }) => {
  try {
    return await axiosInstance.post("/login", loginData);
  } catch (error) {
    throw new Error(`Cannot login : ${error}`);
  }
};

module.exports.register = register;
