import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDto } from 'src/dto/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
    async register(@Body(ValidationPipe) registerDTO: RegisterDto){
        const {email, password, name } = registerDTO
        return this.authService.register(email,password,name);
    }

    @Post('login')
    async login(@Body(ValidationPipe) loginDTO: LoginDTO){
        const {email, password } = loginDTO
        return this.authService.login(email,password);
    }

    @Get('debug/users')
    getUsers(){
        return{
            massage: 'Lista de usuarios registrados',
            count: this.authService.getUserCount(),
            users: this.authService.getAllUsersForDebug()
        }
    }

}
