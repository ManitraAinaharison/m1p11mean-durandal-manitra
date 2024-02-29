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

export interface DailyTasksDetails {
  taskTotal: number;
  taskDone: number;
  totalExpectedDuration: number;
  totalDoneDuration: number;
  totalExpectedComission: number;
  totalReceivedCommission: number;
  appointments: {
    appointmentDate: Dayjs;
    appointmentDateEnd: Dayjs;
    duration: number;
    client: string;
    price: number;
    commission: number;
    status: number;
    subService: {
      name: string
    }
  }[];
}

export interface DailyTasksDetailsResponse
  extends Omit<DailyTasksDetails, 'appointments'> {
  appointments: {
    appointmentDate: Date;
    appointmentDateEnd: Dayjs;
    duration: number;
    client: { firstname: string; lastname: string };
    price: number;
    commission: number;
    status: number;
    subService: {
      name: string;
    };
  }[];
}

export interface AppointmentDetails {
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
    isDeleted: boolean;
    __v: 0;
  };
  client: {
    firstname: string;
    lastname: string;
    name: string;
  };
  duration: number;
  price: number;
  status: number;
  commission: number;
}

export interface AppointmentDetailsResponse
  extends Omit<
    AppointmentDetails,
    'appointmentDate' | 'appointmentDateEnd' | 'client'
  > {
  appointmentDate: Date;
  client: {
    firstname: string;
    lastname: string;
  };
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

export interface GetAppointmentResponse
  extends Omit<GetAppointment, 'appointmentDate'> {
  appointmentDate: Date;
}

export interface PutAppointment extends GetAppointment {}

export interface PutAppointmentResponse extends GetAppointmentResponse {}

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
  _id: string;
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
