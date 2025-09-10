import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    constructor(){
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if(!authHeader){
            console.log('No se encontró header')
        }else{
            console.log('Header Authorization encontrado: ', authHeader.substring(0,20) + '...')
        }

        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        
        if(err){
            console.log('Error en autenticación: ',err.message);
            throw err;
        }

        if(!user){
            console.log('Usuario inválido: ', info?.message || 'Sin información');
            throw new UnauthorizedException('Token de acceso inválido o expirado');
        }

        return user;
    }
}