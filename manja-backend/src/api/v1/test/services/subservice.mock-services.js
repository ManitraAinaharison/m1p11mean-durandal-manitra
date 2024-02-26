const { default: mongoose } = require("mongoose");
const { SubService } = require("../../service/schemas/subservice.schema");
const { Employee } = require("../../auth/schemas/user.schema");

module.exports.postSubServices = postSubServices = async (subServices) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log(subServices.filter((s) => s.ptgCommission === undefined));
    let newSubServices = await SubService.create(subServices);
    await session.commitTransaction();
    return newSubServices;
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

module.exports.updateEmployeesAddSubService = updateEmployeesAddSubService =
  async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const subServicesList = await SubService.find();
      let employees = await Employee.find();
      let count = 0;
      for (let employee of employees) {
        let start = count;
        let limit = count + 3;
        employee.subServices = subServicesList
          .filter((_, index) => {
            const add = index >= start && index < limit;
            if (add) count += 1;
            return add;
          })
          .map((subService) => subService._id);
        await Employee.updateOne(
          { _id: employee._id },
          { subServices: employee.subServices },
          { session }
        );
      }

      await session.commitTransaction();
      return employees;
    } catch (e) {
      console.log(e);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  };
