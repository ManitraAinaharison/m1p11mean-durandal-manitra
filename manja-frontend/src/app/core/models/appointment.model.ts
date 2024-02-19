import { Dayjs } from "dayjs";
import { ServiceModel } from "./salon-service.model";
import { User } from "./user.model";

export interface Appointment {
  appointmentDate: Date;
  client: User;
  employee: User;
  subService: ServiceModel;
  price: number;
  reminders: []; // LOW
  payment: {
    paymentDate: Date;
    amount: number;
  };
  status: number; // 0:
  commision: number;
  statusHistory: [
    {
      status: number;
      statusDate: Date;
    }
  ];
}

export interface DateInterval {
  start: Dayjs,
  end: Dayjs 
}

export interface DateIntervalDetails extends DateInterval {
  dailyPercentage: number;
  duration: number,
  percentageStart: number;
  percentageEnd: number;
}
