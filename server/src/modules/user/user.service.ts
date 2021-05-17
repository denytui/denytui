import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  A;

  public async create(userDto: User): Promise<User> {
    const;
  }
}
