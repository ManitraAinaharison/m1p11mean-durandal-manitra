const authDataFile = require('./auth.datafile');
const { postAdmin, postEmployee, cleanDb, postUser } = require('./auth.mock-services');

module.exports.cleanDb = async () =>{
  await cleanDb()
}

module.exports.createAdmin = createAdmin = async () => {
    const admin = authDataFile.admin;
    try {
        return await postAdmin(admin);
    } catch (error) {
        throw error;
    }
}

module.exports.createEmployees = createEmployees = async () => {
    const result = [];
  const employees = authDataFile.employees;
  try {
    await postEmployee(employees);
    console.log('postEmployees')
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.createUsers = createUsers = async () => {
  const result = [];
  const customers = authDataFile.customers;
  try {
    for (const customer of customers) {
      const cust = await postUser(customer);
      result.push(cust);
    }
    console.log('createUsers')
    return result;
  } catch (error) {
    throw error;
  }
};

// list services
// get a service
// 
// create appointments