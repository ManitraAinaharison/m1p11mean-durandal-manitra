const serviceDataFile = require("./service.datafile");
const { postSubServices } = require("./subservice.mock-services");

module.exports.createSubServices = createSubServices = async () => {
  try {
    return await postSubServices(serviceDataFile.subServices);
  } catch (error) {
    console.log("can't insert sub services");
    throw error;
  } finally {
    console.log("postSubServices");
  }
};


module.exports.assignSubServicesToEmployees = assignSubServicesToEmployees = async () => {
  try {
    return await updateEmployeesAddSubService();
  } catch (error) {
    console.log("can't assing subServices to employees");
    throw error;
  } finally {
    console.log("assignSubServicesToEmployees");
  }
};
