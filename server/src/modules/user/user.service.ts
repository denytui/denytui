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
  public async getUsersByName(usernameOrEmail: string) {
    return await this.prismaService.user.findMany({
      where: {
        OR: [
          { username: { contains: usernameOrEmail, mode: 'insensitive' } },
          { email: { contains: usernameOrEmail, mode: 'insensitive' } },
        ],
      },
    });
  }
  public async getUserById(id: string) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }
  public async getUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  public async getRecentChatUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        receiverFriendMessages: {
          where: { NOT: { id: userId } },
          select: { receiver: true },
        },
      },
    });
    const receivers = user.receiverFriendMessages.map((x) => x.receiver);
    return receivers;
  }
}
