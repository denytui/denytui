import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import moment from 'moment';
import { getTimeDiff } from 'src/commons/utils/time.utils';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  public async getRecentChats(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        receiverFriendMessages: true,
        groupMessages: true,
      },
    });

    let messages = [...user.receiverFriendMessages, ...user.groupMessages];
    messages = messages.sort((a, b) => {
      return moment(a.createdAt).isAfter(b.createdAt) ? -1 : 0;
    });

    messages = messages.map((item) => ({
      ...item,
      time: getTimeDiff(item.createdAt),
    }));

    return messages;
  }
}
