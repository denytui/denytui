import { User } from '.prisma/client';
import { mapUserPayload } from '@modules/user/utils';
import { mapUserOutput } from '@modules/user/utils/map-user-output';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import express, { Request, Response } from 'express';
import { PayloadUserForJwtToken, UserFromRequest } from 'src/commons/types';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthController {
  public router = express.Router();

  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  public async login(req: Request, res: Response) {
    const input = req.body as LoginUserDto;
    const user: User = await this.authService.loginUser(input);

    const payload: PayloadUserForJwtToken = {
      user: mapUserPayload(user),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload);
    this.authService.resetCurrentHashedToken(user.id, refreshToken);
    this.sendRefreshToken(res, refreshToken);
    res.setHeader('authorization', `Bearer ${accessToken}`);
    res.send({ user: mapUserOutput(user), authToken: { accessToken } });
  }

  public async register(req: Request, res: Response) {
    const input = req.body as RegisterUserDto;
    const user: User = await this.authService.registerUser(input);
    const payload: PayloadUserForJwtToken = {
      user: mapUserPayload(user),
    };

    const accessToken = this.jwtService.sign({ user });
    const refreshToken = this.jwtService.sign(payload);
    this.authService.resetCurrentHashedToken(user.id, refreshToken);

    this.sendRefreshToken(res, refreshToken);
    res.setHeader('authorization', `Bearer ${accessToken}`);
    res.send({ user: mapUserOutput(user), authToken: { accessToken } });
  }

  public async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.jid;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.send({ ok: false, accessToken: '' });
    }
    let user: UserFromRequest = null;
    try {
      user = await this.authService.getUserFromRefreshToken(refreshToken);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' });
    }
    if (!user) return res.send({ ok: false, accessToken: '' });

    const accessToken = this.jwtService.sign({ user });
    res.setHeader('authorization', `Bearer ${accessToken}`);

    return res.send({ ok: true, accessToken });
  }

  //------------------------- private------------------------------------
  private sendRefreshToken(res: Response, token: string) {
    res.cookie('jid', token, {
      httpOnly: true,
      path: '/api/auth/refresh-token',
    });
  }
}
