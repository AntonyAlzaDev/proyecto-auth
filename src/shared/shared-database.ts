import { User } from "src/interfaces/user.interface";


export class SharedUserDatabse{

    static users: User[] = [
        {
            id: 1,
            email: 'admin@test.com',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
            name: 'Administrador Principal',
            role: 'admin',
            isActive: true,
            phone: '+51 999 888 777',
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=0d8abc&color=fff',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
            },
            {
            id: 2,
            email: 'user@test.com',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
            name: 'Usuario Normal',
            role: 'user',
            isActive: true,
            phone: '+51 123 456 789',
            avatar: 'https://ui-avatars.com/api/?name=User&background=28a745&color=fff',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
            },
            {
            id: 3,
            email: 'moderator@test.com',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
            name: 'Moderador Sistema',
            role: 'moderator',
            isActive: true,
            phone: '+51 987 654 321',
            avatar: 'https://ui-avatars.com/api/?name=Mod&background=ffc107&color=000',
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date('2024-02-01')
        }
    ]

    static findByEmail(email: string): User | null{
        const user = this.users.find( u =>
            u.email === email.toLowerCase() && u.isActive
        );

        return user || null;
    }

    static findById(id: number): User | null{
        const user = this.users.find( u => u.id === id && u.isActive);
        return user || null;
    }

    static addUser(user: User): void{
        this.users.push(user);
    }

    static updateUser(id: number, updates: Partial<User>): User | null{
        const index = this.users.findIndex( u => u.id === id );

        if( index === -1) return null;

        this.users[index] = { ...this.users[index], ...updates };

        return this.users[index];
    }

    static getActiveUsers():User[]{
        return this.users.filter( u => u.isActive);
    }

    static getAllUsers():User[]{
        return this.users;
    } 

    static getTotalCount():number{
        return this.users.length;
    } 

    static getActiveCount():number{
        return this.users.filter( u => u.isActive).length;
    } 





    

}