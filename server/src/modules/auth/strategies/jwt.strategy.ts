import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { envConfig } from 'src/commons/configs/env.config';
import { PayloadUserForJwtToken } from 'src/commons/types';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envConfig().jwt.jwtSecret,
    });
  }

  async validate(payload: PayloadUserForJwtToken): Promise<User> {
    const user: User = await this.prismaService.user.findUnique({
      where: { id: payload?.user?.id },
    });
    return user;
  }
}
