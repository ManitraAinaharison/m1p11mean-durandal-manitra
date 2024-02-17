import { ServiceModel, SubService } from "./salon-service.model";

export interface User {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
}

export type Credentials = Pick<User, 'email' | 'password'>;
export type SignUpData = Pick<User, 'firstname' | 'lastname' | 'email' | 'username' | 'password'>;

export interface Employee extends User {
  subServices: SubService[];
  imgPath: string;
}
