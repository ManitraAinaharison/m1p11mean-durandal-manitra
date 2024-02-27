import { Dayjs } from 'dayjs';
import { ServiceModel, SubServiceModel } from './salon-service.model';
import { User } from './user.model';

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
  commission: number;
  statusHistory: [
    {
      status: number;
      statusDate: Date;
    }
  ];
}
export interface GetAppointment {
  _id: string;
  appointmentDate: Dayjs;
  employee: Pick<User, 'firstname' | 'lastname'>;
  subService: Pick<SubServiceModel, 'slug' | 'name'>;
  price: number;
  status: number;
  duration: number;
  // statusHistory: [
  //   {
  //     status: number;
  //     statusDate: Date;
  //   }
  // ];
}

export interface GetAppointmentResponse extends Omit<GetAppointment, 'appointmentDate'>{
  appointmentDate: Date
}

export interface PutAppointment extends GetAppointment{};

export interface PutAppointmentResponse extends GetAppointmentResponse{};

export interface PostAppointment {
  appointmentDate: Date;
  employeeId: string;
  subServiceSlug: string;
}

export interface AppointmentHistory {
  _id: string;
  appointmentDate: Dayjs;
  appointmentDateEnd: Dayjs;
  employee: {
    firstname: string;
    lastname: string;
  };
  subService: {
    name: string;
    slug: string;
    __v: number;
  };
  duration: number;
  price: number;
  status: number;
}

export interface AppointHistoryResponse
  extends Omit<AppointmentHistory, 'appointmentDate' | 'appointmentDateEnd'> {
  appointmentDate: Date;
}

export interface PostAppointmentResponse {
  appointmentDate: Date;
  client: string;
  employee: string;
  subService: string;
  duration: number;
  price: number;
  commission: number;
  statusHistory: [
    {
      status: 0;
      statusDate: Date;
    }
  ];
}

export interface DateInterval {
  start: Dayjs;
  end: Dayjs;
}

export interface DateIntervalDetails extends DateInterval {
  dailyPercentage: number;
  duration: number;
  percentageStart: number;
  percentageEnd: number;
}

export interface PrimaryDateInterval {
  start: Date;
  end: Date;
}

export interface EmployeeSchedule {
  unavailableSchedules: DateInterval[];
  workSchedules: DateInterval[];
}
export interface PrimaryDateEmployeeSchedule {
  unavailableSchedules: PrimaryDateInterval[];
  workSchedules: PrimaryDateInterval[];
}
