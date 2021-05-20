import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import moment from 'moment';
import { getTimeDiff } from 'src/commons/utils/time.utils';
import { ContentType, RoleType } from '.prisma/client';
import { ModifyFriendMessageDto } from './dto';

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

  public async getFriendMessages(userId: string, friendId: string) {
    const friendMessages = await this.prismaService.friendMessage.findMany({
      where: { senderId: userId, receiverId: friendId },
    });
    return friendMessages;
  }

  public async getGroupMessages(groupId: string) {
    const groupMessages = await this.prismaService.groupMessage.findMany({
      where: { group: { id: groupId } },
    });
    return groupMessages;
  }

  public async getRecentChatUsers(userId: string) {
    const friendMessages = await this.prismaService.friendMessage.findMany({
      where: { senderId: userId },
      select: { receiver: true },
    });
    const chatUsers = friendMessages.map((x) => x.receiver);
    return chatUsers;
  }

  public async sendMessageToFriend(
    senderId: string,
    receiverId: string,
    content: string,
    type?: ContentType,
  ) {
    const friendMessage = await this.prismaService.friendMessage.create({
      data: {
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
        content,
        type,
      },
    });
    return friendMessage;
  }

  public async sendMessageToGroup(
    userId: string,
    groupId: string,
    content: string,
    type?: ContentType,
  ) {
    const groupMessage = await this.prismaService.groupMessage.create({
      data: {
        user: { connect: { id: userId } },
        group: { connect: { id: groupId } },
        content,
        type,
      },
    });

    return groupMessage;
  }

  public async modifyFriendMessage(
    friendMessageId: string,
    modifyDto: ModifyFriendMessageDto,
  ) {
    const updated = await this.prismaService.friendMessage.update({
      where: { id: friendMessageId },
      data: {
        content: modifyDto.content,
      },
    });
    return updated;
  }

  public async modifyGroupMessage(
    groupMessageId: string,
    modifyDto: ModifyFriendMessageDto,
  ) {
    const updated = await this.prismaService.friendMessage.update({
      where: { id: groupMessageId },
      data: { content: modifyDto.content },
    });
    return updated;
  }

  public async deleteFriendMessage(senderId: string, friendMessageId: string) {
    const groupMessage = await this.prismaService.friendMessage.findUnique({
      where: { id: friendMessageId },
      select: { sender: true },
    });

    // If user is admin or user owned this message
    if (groupMessage.sender.id == senderId) {
      return await this.prismaService.friendMessage.delete({
        where: { id: friendMessageId },
      });
    }
    throw new UnauthorizedException();
  }

  public async deleteGroupMessage(userId: string, groupMessageId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    const groupMessage = await this.prismaService.groupMessage.findUnique({
      where: { id: groupMessageId },
      select: { user: true },
    });

    // If user is admin or user owned this message
    if (user.role == RoleType.ADMIN || groupMessage?.user?.id == userId) {
      return await this.prismaService.groupMessage.delete({
        where: { id: groupMessageId },
      });
    }
    throw new UnauthorizedException();
  }
}
