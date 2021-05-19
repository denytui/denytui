import { GroupService } from '@modules/group/group.service';
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

@WebSocketGateway(1080, { namespace: 'groups' })
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: any;

  connectedUsers: User[] = [];

  constructor(
    private jwtService: JwtService,
    private groupService: GroupService,
  ) {}

  public async handleConnection(socket) {
    const { user } = this.jwtService.verify(socket.handshake.query.token);
    if (!user) throw new WsException('Unauthorized');

    this.connectedUsers = [...this.connectedUsers, user];

    // Send list of connected users
    this.server.emit('users', this.connectedUsers);
  }

  public async handleDisconnect(socket) {
    const { user } = this.jwtService.verify(socket.handshake.query.token);

    this.connectedUsers = this.connectedUsers.filter((u) => u.id != user.id);

    // Send new list connected users
    this.server.emit('users', this.connectedUsers);
  }

  @SubscribeMessage('message')
  public async onMessage(client, data: any) {
    const event = 'message';
    const result = data[0];
    await this.groupService.addMessage(
      result.group.id,
      result.user.id,
      result.message,
    );

    client.broadcast.to(result.group).emit(event, result.message);

    return { event, data: result.message };
  }

  @SubscribeMessage('join')
  public async onGroupJoin(client, data: any) {
    const groupId = data[0];
    client.join(groupId);
    const messages = await this.groupService.getMessagesOfGroup(groupId);

    // Send last messages to the connected user
    client.emit('message', messages);
  }

  @SubscribeMessage('leave')
  public async onGroupLeave(client, data: any) {
    client.leave(data[0]);
  }
}
