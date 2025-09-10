import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class LoginDto{

    @IsEmail({}, { message: 'Email debetener formato válido' })
    email: string;

    @IsString({message: 'Password debe ser texto'})
    @MinLength(6,{message:'Password mínimo 6 caracteres'})
    password: string;
}

export class RegisterDto extends LoginDto{

    @IsString({message: 'Nombre debe ser texto'})
    @MinLength(2,{message:'Nombre mínimo 2 caracteres'})
    @MaxLength(100,{message:'Nombre máximo 100 caracteres'})
    name: string;


    @IsOptional()
    @IsIn(['user', 'admin', 'moderator'], {message:'Rol debe ser: user,admin o moderator'})
    role?: 'user' | 'admin' | 'moderator'
}

export class UpdateUserDto{
    @IsOptional()
    @IsString({message: 'Nombre debe ser texto'})
    @MinLength(2,{message:'Nombre mínimo 2 caracteres'})
    @MaxLength(100,{message:'Nombre máximo 100 caracteres'})
    name?: string;

    @IsOptional()
    @IsString({message: 'Teléfono debe ser texto'})
    @MaxLength(20,{message:'Teléfono máximo 20 caracteres'})
    phone?: string;

    @IsOptional()
    @IsString({message: 'Avatar debe ser URL válida'})
    @MaxLength(500,{message:'URL avatar máximo 500 caracteres'})
    avatar?: string;
}

export class ChangePasswordDto{
    @IsString({message: 'Password actual requerido'})
    currentPassword: string;

    @IsString({message: 'Nuevo Password debe ser texto'})
    @MinLength(6,{message:'Nuevo Password mínimo 6 caracteres'})
    @MaxLength(50,{message:'Nuevo Password máximo 50 caracteres'})
    newPassword: string;

}