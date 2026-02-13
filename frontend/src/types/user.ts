export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager';
    avatar: string;
}

export interface UserState {
    user: User | null;
    token: string;
    error: string | null;
    loading: boolean;
}

export interface ParamsLogin {
    email: string;
    password: string;
}

export interface ParamsRegister {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'manager';
}