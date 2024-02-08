export interface User {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    token: string;
}

export type Credentials = Pick<User, 'username' | 'password'>;
export type SignUpData = Pick<User, 'firstname' | 'lastname' | 'email' | 'username' | 'password'>;