import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/commons/types';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  public async getUsers(paginationDto: PaginationDto) {
    const limit = paginationDto.limit || 25;
    const page = paginationDto.page || 1;

    const count = await this.prismaService.user.count();
    const users = await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { count, users };
  }
}
