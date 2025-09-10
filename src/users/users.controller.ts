import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, CurrentUserId } from 'src/auth/jwt/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { AdminGuard } from 'src/auth/jwt/admin.guard';
import { UpdateUserDto } from 'src/dto/user.dto';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService){

    }


    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMyProfile(@CurrentUserId() userId: number) {
        console.log('👤 UsersController.getMyProfile() para usuario ID:', userId);
        return this.usersService.findOne(userId);
    }

    @Put('me')
    @UseGuards(JwtAuthGuard)
    updateMyProfile(
        @CurrentUserId() userId: number,
        @CurrentUser() user: any,
        @Body(ValidationPipe) updateUserDto: UpdateUserDto
    ) {
        console.log('✏️ UsersController.updateMyProfile() para:', user.email);
        return this.usersService.update(userId, updateUserDto, user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getUserById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: any
    ) {
        console.log('👤 UsersController.getUserById() ID:', id, 'solicitado por:', user.email);
        return this.usersService.findOne(id, user);
    }


    // RUTAS AUTENTICADAS

    
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAllUsers(@CurrentUser() admin: any) {
    console.log('📋 UsersController.getAllUsers() ejecutado por admin:', admin.email);
    return this.usersService.findAll(admin);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, AdminGuard)
  searchUsers(
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('role') role?: string,
    @CurrentUser() admin?: any
  ) {
    console.log('🔍 UsersController.searchUsers() con criterios:', { email, name, role });
    
    const criteria = { email, name, role };
    return this.usersService.search(criteria, admin);
  }

//   @Get('admin/stats')
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   getSystemStats(@CurrentUser() admin: any) {
//     console.log('📊 UsersController.getSystemStats() por admin:', admin.email);
//     return this.usersService.getStats(admin);
//   }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateAnyUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @CurrentUser() admin: any
  ) {
    console.log('✏️ UsersController.updateAnyUser() ID:', id, 'por admin:', admin.email);
    return this.usersService.update(id, updateUserDto, admin);
  }


}
