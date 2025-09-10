import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'proyecto-auth-DMC'
        });
    }

    async validate(payload: any){
        if(!payload.sub || !payload.email){
            throw new UnauthorizedException('Token inválido: información incompleta');
        }

        const user = {
            userId: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role || 'user',
        }

        return user
    }

}