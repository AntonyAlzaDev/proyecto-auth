import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDTO{
    @IsEmail({}, {message: 'Debe ser un email válido'})
    email: string;
    @IsString({message: 'La contraseña debe ser texto'})
    @MinLength(6,{message: 'Mínimo 6 caracteres'})
    password: string
}

export class RegisterDto extends LoginDTO{
    @IsString({message: 'La contraseña debe ser texto'})
    @MinLength(2,{message: 'Mínimo 2 caracteres'})
    @MaxLength(100, {message: 'Máximo 100 caracteres'})
    name: string;
}