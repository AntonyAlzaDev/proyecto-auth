export interface User{
    id: number;
    email: string;
    password: string;
    name: string;
    role?: string;
    isActive?: boolean;
    phone?: string;
    avatar?: string;
    createdAt?: Date;
    updateAt?: Date;
}



export type UserWithoutPassword = Omit<User, 'password'>