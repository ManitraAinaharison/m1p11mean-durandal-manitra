const apiUtil = require("../../../../util/api.util");
const { Ebit } = require("../schema/ebit.schema");
const { Appointment } = require("../../service/schemas/appointment.schema");


module.exports.getListOfEbit = async () => {
  try {
    return await Ebit.find({}, '-__v').sort({ ebitDate: -1 });
  } catch (e) {
    throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500);
  }
};

module.exports.addNewEbit = async (ebitData) => {
    try {
      const startOfMonth = new Date(ebitData.year, ebitData.month, 1); 
      const endOfMonth = new Date(ebitData.year, ebitData.month + 1, 0);
      let appointments = await Appointment.find({
          'payment.paymentDate': {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
      });
      ebitData.sales = 0;
      appointments.forEach((appointment) => { ebitData.sales += appointment.price; });

      let totalExpense = 0;
      ebitData.expenses.forEach((expense) => totalExpense += expense.amount);

      ebitData.ebitDate = new Date();
      ebitData.totalProfit = ebitData.sales - totalExpense;
      let ebit = new Ebit(ebitData);
      ebit = await ebit.save();
      return  await Ebit.findById(ebit._id, '-__v');
    } catch (e) {
      throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500);
    }
};