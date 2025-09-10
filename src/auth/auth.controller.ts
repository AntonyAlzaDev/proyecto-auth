import { Body, Controller, Get, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto, RegisterDto } from 'src/dto/user.dto';
import { CurrentUser, CurrentUserId } from './jwt/current-user.decorator';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { AdminGuard } from './jwt/admin.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
    async register(@Body(ValidationPipe) registerDTO: RegisterDto){
        const {email, password, name } = registerDTO
        return this.authService.register(email,password,name);
    }

    @Post('login')
    async login(@Body(ValidationPipe) loginDTO: LoginDto){
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

// ENDPOINTS PROTEGIDOS

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user: any){

        return{
            message: 'Perfil de usuario autenticado',
            user: {
                id: user.userId,
                email: user.email,
                name: user.name,
                rol: user.rol
            },
            accessTime: new Date(),
            tokenInfo: 'Token válido y activo'
        }
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword( @CurrentUserId() userId: number, @Body(ValidationPipe) changePasswordDto: ChangePasswordDto ){

        const {currentPassword, newPassword} = changePasswordDto;

        return this.authService.changePassword(userId, currentPassword, newPassword);
    }


    // END POINT PARA ADMINISTRADORES

    @Get('debug/user')
    @UseGuards(JwtAuthGuard, AdminGuard)
    debugGetUsers(@CurrentUser() admin: any){

        return {
            message: 'Lista completa de usuarios (solo para administradores)',
            requestedBy: admin.email,
            totalUser: this.authService.getUserCount(),
            activeUsers: this.authService.getActiveUsers(),
            users: this.authService.getAllUsersForDebug()
        }
    }

    


}
