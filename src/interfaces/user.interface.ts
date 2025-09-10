export interface User{
    id: number;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin' | 'moderator';
    isActive: boolean;
    phone?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export type UserWithoutPassword = Omit<User, 'password'>

export interface UserStats{
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    regularUsers: number;
    moderatorUsers: number;
    newUsersThisMoth: number;
}

export interface LoginCredentials{
    email: string;
    password: string;
}

export interface RegisterData{
    email: string;
    password: string;
    name: string;
}

