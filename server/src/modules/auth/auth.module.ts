import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envConfig } from 'src/commons/configs';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
    JwtModule.register({
      secret: envConfig().jwt.jwtSecret,
    }),
  ],
  providers: [PrismaService, JwtStrategy, AuthService, PasswordService],
})
export class AuthModule {}
