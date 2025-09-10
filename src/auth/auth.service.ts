import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';
import { User, UserWithoutPassword } from 'src/interfaces/user.interface';
import { SharedUserDatabse } from 'src/shared/shared-database';

@Injectable()
export class AuthService {
 
    constructor(private jwtService: JwtService){
    }


    async register(email: string, password: string, name: string, role: 'user' | 'admin' | 'moderator' = 'user'){
        
        const existingUser = SharedUserDatabse.findByEmail(email);

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
            role: role,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        SharedUserDatabse.addUser(newUser);

        return {
            message:  'Usuario registrado exitosamente',
            userId: newUser.id,
            user:{
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        };
    }

    async login(email: string, password: string){
        
        const user = SharedUserDatabse.findByEmail(email);

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
            role: user.role,
            iat: Math.floor(Date.now()/1000)
        };


        const accesToken = this.jwtService.sign(payload);

        const userResponse : UserWithoutPassword = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            phone: user.phone,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        return{
            acces_token: accesToken,
            user: userResponse,
            message: 'Login exitoso',
            tokenType: 'Bearer',
            expiresIn:'1h'
        }
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string){

        const user = SharedUserDatabse.findById(userId);
        
        if(!user){
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword,user.password);

        if(!isCurrentPasswordValid){
            throw new UnauthorizedException('Contraseña actual incorrecta');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword,10);

        SharedUserDatabse.updateUser(userId,{
            password: hashedNewPassword,
            updatedAt: new Date()
        });

        return {message: 'Contraseña actualizada exitosamente'}

    }


    getAllUsersForDebug(): UserWithoutPassword[]{
        return SharedUserDatabse.getAllUsers().map(user =>{
            // const usarioIterado = user;
            const {password, ...userWithoutPassword} = user;
            
            return userWithoutPassword;
        });
    }

    getActiveUsers(): number{
        return SharedUserDatabse.getActiveCount();
    }

    getUserCount():number{
        return SharedUserDatabse.getTotalCount();
    }

}
