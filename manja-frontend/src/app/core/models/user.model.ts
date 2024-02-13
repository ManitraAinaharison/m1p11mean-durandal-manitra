export interface User {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
}

export type Credentials = Pick<User, 'email' | 'password'>;
export type SignUpData = Pick<User, 'firstname' | 'lastname' | 'email' | 'username' | 'password'>;
