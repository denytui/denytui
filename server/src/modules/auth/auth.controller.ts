import { User } from '.prisma/client';
import { mapUserPayload } from '@modules/user/utils';
import { mapUserOutput } from '@modules/user/utils/map-user-output';
import { Controller, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import express, { Request, Response } from 'express';
import { PayloadUserForJwtToken, UserFromRequest } from 'src/commons/types';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  public router = express.Router();

  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  public async me(@Req() req: Request) {
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) return null;
    const token = bearerToken.split(' ')[1];
    if (!token) return null;

    const { user } = this.jwtService.verify(token);

    return { user };
  }

  @Post('login')
  public async login(@Req() req: Request) {
    const input = req.body as LoginUserDto;
    const user: User = await this.authService.loginUser(input);

    const payload: PayloadUserForJwtToken = {
      user: mapUserPayload(user),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload);
    this.authService.resetCurrentHashedToken(user.id, refreshToken);
    this.sendRefreshToken(req?.res, refreshToken);
    req?.res?.setHeader('authorization', `Bearer ${accessToken}`);

    return { user: mapUserOutput(user), authToken: { accessToken } };
  }

  public async register(@Req() req: Request) {
    const input = req.body as RegisterUserDto;
    const user: User = await this.authService.registerUser(input);
    const payload: PayloadUserForJwtToken = {
      user: mapUserPayload(user),
    };

    const accessToken = this.jwtService.sign({ user });
    const refreshToken = this.jwtService.sign(payload);
    this.authService.resetCurrentHashedToken(user.id, refreshToken);

    this.sendRefreshToken(req?.res, refreshToken);
    req?.res.setHeader('authorization', `Bearer ${accessToken}`);

    return { user: mapUserOutput(user), authToken: { accessToken } };
  }

  public async refreshToken(@Req() req: Request) {
    const refreshToken = req.cookies.jid;
    if (!refreshToken) {
      return { ok: false, accessToken: '' };
    }
    let user: UserFromRequest = null;
    try {
      user = await this.authService.getUserFromRefreshToken(refreshToken);
    } catch (err) {
      return { ok: false, accessToken: '' };
    }
    if (!user) return { ok: false, accessToken: '' };

    const accessToken = this.jwtService.sign({ user });
    req?.res.setHeader('authorization', `Bearer ${accessToken}`);

    return { ok: true, accessToken };
  }

  //------------------------- private------------------------------------
  private sendRefreshToken(res: Response, token: string) {
    res.cookie('jid', token, {
      httpOnly: true,
      path: '/api/auth/refresh-token',
    });
  }
}
