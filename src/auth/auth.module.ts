import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { AdminGuard } from './jwt/admin.guard';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false
    }),

    JwtModule.register({
      secret: 'proyecto-auth-DMC',
      signOptions: { 
        expiresIn: '1h', 
        algorithm: 'HS256'
      }

    })
  ],
  providers: [AuthService, JwtStrategy,JwtAuthGuard,AdminGuard],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtAuthGuard,
    AdminGuard,
    JwtStrategy
  ]
})
export class AuthModule {}
