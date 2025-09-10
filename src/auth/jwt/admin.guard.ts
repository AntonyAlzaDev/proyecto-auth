import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";


@Injectable()
export class AdminGuard implements CanActivate{

    constructor(){
        console.log('AdminGuard inicializado')
    }

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if(!user){
            throw new ForbiddenException('Usuario no autorizado');
        }

        if(user.role !== 'admin'){
            throw new ForbiddenException(
                `Acceso denegado: Se requien privilegios de administrador. Tu rol actual es: ${user.rol}`
            )
        }

        return true;
        
    }

}