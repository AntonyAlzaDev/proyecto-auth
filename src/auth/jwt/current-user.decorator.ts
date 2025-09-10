import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {

        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if(!user){
            console.log('No se encontró usuario en request.user')
            return null
        }

        return user;
    }
)


export const CurrentUserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if(!user){
            console.log('No se encontró un id de usuario en request.user')
            return null
        }

        return user.userId;
    }
)


export const CurrentUserRole = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if(!user){
            console.log('CurrentUserRole: No hay usuario autenticado')
            return null
        }

        return user.role;
    }
);