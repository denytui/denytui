import { GroupService } from '@modules/group/group.service';
import { MessageService } from '@modules/message/message.service';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { errorResp, successResp } from 'src/commons/types/socket.types';
import { v4 as uuid } from 'uuid';

@WebSocketGateway()
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;
  public liveUserIds: Set<string>;

  connectedUsers: User[] = [];

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private messageService: MessageService,
  ) {}

  public afterInit(_server: any) {
    Logger.log('socket gateway init');
  }
  public handleConnection(client: any, ...args: any[]) {
    const id = client.handshake?.query?.userId;
    if (id) {
      client.join(id);
      this.liveUserIds.add(id);
      this.server.emit('onlineStatus', Array.from(this.liveUserIds));
      Logger.log(`User with Id = ${id} has been connected!`);
    }
  }
  handleDisconnect(client: any) {
    const id = client.handshake?.query?.userId;
    this.liveUserIds.delete(id);
    this.server.emit('onlineStatus', Array.from(this.liveUserIds));
    Logger.log(`User with id = ${id} is offline now!`);
  }

  @SubscribeMessage('friendChatConnect')
  public async friendChatConnect(client: Socket, data) {
    const { senderId, receiverId, content } = data;
    const roomId = uuid();
    try {
      const message = await this.messageService.sendMessageToFriend(
        senderId,
        receiverId,
        content,
      );

      this.server.to(roomId).emit('friendChatMessage', successResp(message));
      this.server.to(receiverId).emit('notice', successResp(message));
    } catch (error) {
      this.server.to(roomId).emit('friendChatMessage', errorResp(error));
    }
  }

  @SubscribeMessage('notice')
  public async notice(_client: Socket, _data: any) {
    return 'Successfully subscribed';
  }

  @SubscribeMessage('groupChatConnect')
  public async groupChatConnect(client: Socket, data: any) {
    const { userId, groupId } = data;
    try {
      // Check if user is belong to this group
      const isInGroup = await this.groupService.isUserBelongToGroup(
        userId,
        groupId,
      );
      if (!isInGroup) throw new UnauthorizedException();

      // if user is already a member of group
      client.join(groupId);
      const user = this.userService.getUserById(userId);
      this.server
        .to(groupId)
        .emit(
          'groupChatConnect',
          successResp(data, `${(await user).username} is connected`),
        );
    } catch (error) {
      this.server.emit('groupChatConnect', errorResp(error));
    }
  }

  @SubscribeMessage('groupChatMessage')
  public async groupChatMessage(client: Socket, data: any) {
    const { userId, groupId, content } = data;
    try {
      const message = await this.messageService.sendMessageToGroup(
        userId,
        groupId,
        content,
      );

      this.server.to(groupId).emit('groupChatMessage', successResp(message));
      await this.noticeGroupMember(userId, groupId, content);
    } catch (error) {
      this.server.emit('groupChatMessage', errorResp(error));
    }
  }

  private async noticeGroupMember(
    userId: string,
    groupId: string,
    content: string,
  ) {
    const members = await this.groupService.getGroupMembers(groupId);
    const userIds = members.map((user) => user.id);

    const liveGroupMembers = userIds
      .filter((item) => this.liveUserIds.has(item))
      .filter((item) => item != userId);

    liveGroupMembers.forEach((member) => {
      this.server.to(member).emit('notice', content);
    });
  }
}
