import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';
import { User, UserWithoutPassword } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
    private static userDB: User[] = [
        {
            id: 1,
            email: 'admin@test.com',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
            name: 'Administrador Sistema',
            role: 'admin',
            isActive: true,
            createdAt: new Date('2024-01-01')
        }
    ];

    constructor(private jwtService: JwtService){}


    async register(email: string, password: string, name: string){
        
        const existingUser = AuthService.userDB.find(u => u.email.toLowerCase() === email.toLowerCase());

        if(existingUser){
            throw new ConflictException('Ya existe un usuario con ese email');
        }

        if(!email || !password || !name){
            throw new ConflictException('Todos los campos son requeridos');
        }

        if(password.length < 6){
            throw new ConflictException('La contraseña debe de tener al menos 6 caracteres');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: Date.now(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            name: name.trim(),
            role: 'user',
            isActive: true,
            createdAt: new Date()
        };

        AuthService.userDB.push(newUser);

        return {
            message:  'Usuario registrado exitosamente',
            userId: newUser.id,
            user:{
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        };
    }

    async login(email: string, password: string){
        
        const user = AuthService.userDB.find( u =>
            u.email === email.toLowerCase() && u.isActive
        );

        if(!user){
            throw new UnauthorizedException('Email o ontraseña incorrectos');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            throw new UnauthorizedException('Contraseña incorrecta')
        }

        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };


        const accesToken = this.jwtService.sign(payload);

        const userResponse : UserWithoutPassword = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        }

        return{
            acces_token: accesToken,
            user: userResponse,
            message: 'Login exitoso'
        }
    }

    getAllUsersForDebug(): UserWithoutPassword[]{
        return AuthService.userDB.map(user =>{
            // const usarioIterado = user;
            const {password, ...userWithoutPassword} = user;
            
            return userWithoutPassword;
        });
    }

    getUserCount():number{
        return AuthService.userDB.length;
    }

}
