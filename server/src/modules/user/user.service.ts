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
    const count = receivers.length;
    return { count, users: receivers };
  }

  //  Friends relations
  public async getFriends(
    userId: string,
    queryName?: string,
    pagination?: PaginationDto,
  ) {
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;

    //--------------------------------------------
    // Query normally, no query name
    if (!queryName) {
      const friends = await this.prismaService.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      const count = await this.prismaService.user.count();
      return { count, friends };
    }

    // With query name
    const friends = await this.prismaService.user.findMany({
      where: {
        OR: [
          { username: { contains: queryName, mode: 'insensitive' } },
          { email: { contains: queryName, mode: 'insensitive' } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    const count = await this.prismaService.user.count({
      where: {
        OR: [
          { username: { contains: queryName, mode: 'insensitive' } },
          { email: { contains: queryName, mode: 'insensitive' } },
        ],
      },
    });

    return { count, friends };
  }

  public async addFriend(userId: string, friendId: string) {
    if (this.checkAlreadyFriend) {
      const newFriend = await this.prismaService.userFriend.create({
        data: {
          user: { connect: { id: userId } },
          friend: { connect: { id: friendId } },
        },
      });
      return newFriend;
    }
    return { alreadyFriend: true };
  }
  public async removeFriend(userId: string, friendId: string) {
    try {
      await this.prismaService.userFriend.deleteMany({
        where: { AND: [{ userId }, { friendId }] },
      });
      return { deleted: true };
    } catch (error) {
      return { deleted: false };
    }
  }

  //--
  private async checkAlreadyFriend(userId: string, friendId: string) {
    const userFriends = await this.prismaService.userFriend.findMany({
      where: { AND: [{ userId }, { friendId }] },
    });
    return userFriends?.length > 0;
  }
}
