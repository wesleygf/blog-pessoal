import { Module } from '@nestjs/common';
import { Bcrypt } from './bcrypt/bcrypt';
import { UsuarioModule } from '../usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConatnts } from './constants/constants';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConatnts.secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [Bcrypt, AuthService, LocalStrategy],
  controllers: [],
  exports: [Bcrypt],
})
export class AuthModule {}
