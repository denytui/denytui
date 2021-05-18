import { RoomService } from '@modules/room/room.service';
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
import { from, Observable } from 'rxjs';
import { UserFromRequest } from 'src/commons/types';

@WebSocketGateway(1080, { namespace: 'rooms' })
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: any;

  connectedUsers: User[] = [];

  constructor(
    private jwtService: JwtService,
    private roomService: RoomService,
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
    await this.roomService.addMessage(
      result.room.id,
      result.user.id,
      result.message,
    );

    client.broadcast.to(result.room).emit(event, result.message);

    return { event, data: result.message };
  }

  @SubscribeMessage('join')
  public async onRoomJoin(client, data: any) {
    const roomId = data[0];
    client.join(roomId);
    const messages = await this.roomService.getMessagesOfRoom(roomId);

    // Send last messages to the connected user
    client.emit('message', messages);
  }

  @SubscribeMessage('leave')
  public async onRoomLeave(client, data: any) {
    client.leave(data[0]);
  }
}
