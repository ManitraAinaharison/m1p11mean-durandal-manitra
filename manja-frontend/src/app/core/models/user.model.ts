import { ServiceModel, SubServiceModel } from "./salon-service.model";

export interface User {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    isActive?: boolean;
}

export type Credentials = Pick<User, 'email' | 'password'>;
export type SignUpData = Pick<User, 'firstname' | 'lastname' | 'email' | 'username' | 'password'>;

export interface Employee extends User {
  _id?: string,
  subServices: SubServiceModel[];
  imgPath: string;
}
