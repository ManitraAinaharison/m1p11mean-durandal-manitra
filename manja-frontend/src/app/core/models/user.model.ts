export interface User {
    username: string;
    email: string;
    firstname?: string;
    lastname?: string;
    token: string;
}

export interface Credentials { 
    username: string;
    password: string;
}