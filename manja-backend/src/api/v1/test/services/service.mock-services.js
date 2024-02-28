const { default: mongoose } = require("mongoose");
const { Service } = require("../../service/schemas/service.schema");

module.exports.postServices = postServices = async (services) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let newServices = await Service.create(services);
    await session.commitTransaction();
    return newServices;
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};
