const apiUtil = require("../../../../util/api.util");
const { Appointment } = require("../../service/schemas/appointment.schema");

module.exports.getCurrentSales = async () => {
    try {
        const now = new Date();
        let sales = {
          today: {
            nbrAppointments: 0,
            sales: 0
          },
          yesterday: {
            nbrAppointments: 0,
            sales: 0
          },
          currentMonth: {
            nbrAppointments: 0,
            sales: 0
          },
          lastMonth: {
            nbrAppointments: 0,
            sales: 0
          },
        };

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); 
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        let appointmentsCurrentMonth = await Appointment.find({
          'payment.paymentDate': {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        });
        sales.currentMonth.nbrAppointments = appointmentsCurrentMonth.length;  
        appointmentsCurrentMonth.forEach((appointment) => { sales.currentMonth.sales += appointment.price; });
        startOfMonth.setMonth(startOfMonth.getMonth() - 1);
        endOfMonth.setMonth(endOfMonth.getMonth() - 1);
        let appointmentsLastMonth = await Appointment.find({
          'payment.paymentDate': {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        });
        sales.lastMonth.nbrAppointments = appointmentsLastMonth.length;  
        appointmentsLastMonth.forEach((appointment) => { sales.lastMonth.sales += appointment.price; });



        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, -1);
        let appointmentsToday = await Appointment.find({
          'payment.paymentDate': {
            $gte: startOfDay,
            $lt: endOfDay
          }
        });
        sales.today.nbrAppointments = appointmentsToday.length;  
        appointmentsToday.forEach((appointment) => { sales.today.sales += appointment.price; });
        startOfDay.setDate(startOfDay.getDate() - 1);
        endOfDay.setDate(endOfDay.getDate() - 1);
        let appointmentsYesterday = await Appointment.find({
          'payment.paymentDate': {
            $gte: startOfDay,
            $lt: endOfDay
          }
        });
        sales.today.nbrAppointments = appointmentsYesterday.length;  
        appointmentsYesterday.forEach((appointment) => { sales.today.sales += appointment.price; });

        return sales;
    } catch (e) {
      throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500);
    }
};

module.exports.getSalesAndAppointmentsNumberForLast = async (nbrMonth) => {
  try {
    const now = new Date();
    let res = [];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); 
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    for (let i = 0; i < nbrMonth; i++) {
      startOfMonth.setMonth(startOfMonth.getMonth() - i);
      endOfMonth.setMonth(endOfMonth.getMonth() - i);
      let appointmentsLastMonth = await Appointment.find({
        'payment.paymentDate': {
          $gte: startOfMonth,
          $lt: endOfMonth
        }
      });
      const nbrApptmnts = appointmentsLastMonth.length;  
      let sales = 0;
      appointmentsLastMonth.forEach((appointment) => { sales += appointment.price; });
      res.push({
        month: now.getMonth(),
        year: now.getFullYear(),
        nbrAppointments: nbrApptmnts,
        sales: sales
      })
      now.setMonth((now.getMonth() - 1) == 0 ? 11 : now.getMonth() - 1);
      if ((now.getMonth() - 1) == 0) now.setFullYear(now.getFullYear() - 1);
    }
    return res;
  } catch (e) {
    throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500);
  }
};