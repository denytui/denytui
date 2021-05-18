import { PasswordService } from './password.service';
import { User } from '@prisma/client';
import { LoginUserDto, RegisterUserDto } from '../dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { emailRegex } from '@modules/user/types/user.types';
import { UserFromRequest } from 'src/commons/types';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  public async registerUser(input: RegisterUserDto): Promise<User> {
    const user = await this.prismaService.user.create({
      data: {
        ...input,
        password: await this.passwordService.hash(input.password),
      },
    });
    return user;
  }

  public async loginUser(input: LoginUserDto): Promise<User> {
    const { usernameOrEmail, password } = input;
    const isEmail = emailRegex.test(usernameOrEmail);
    let user: User;
    if (isEmail)
      user = await this.prismaService.user.findUnique({
        where: { email: usernameOrEmail },
      });
    else
      user = await this.prismaService.user.findUnique({
        where: { username: usernameOrEmail },
      });
    if (!user) throw new BadRequestException('Invalid credentials');

    // check password
    const isMatch = await this.passwordService.verify(user.password, password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    return user;
  }

  public async getUserFromRefreshToken(
    refreshToken: string,
  ): Promise<User | UserFromRequest> {
    const { user } = this.jwtService.verify(refreshToken);
    if (!user) return null;
    const realUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });
    if (!realUser) return null;

    const isMatch = await this.passwordService.verify(
      realUser.currentHashedRefreshToken,
      refreshToken,
    );
    if (!isMatch) return null;
    return user;
  }

  public async resetCurrentHashedToken(userId: string, refreshToken: string) {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        currentHashedRefreshToken: await this.passwordService.hash(
          refreshToken,
        ),
      },
    });
    return user;
  }
}
