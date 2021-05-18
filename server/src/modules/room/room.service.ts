import { Message } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/commons/types';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateRoomDto } from './dto';
import { prismaRoomSelect } from './dto/room-select';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  public async getRooms(paginationDto: PaginationDto) {
    const limit = paginationDto.limit || 25;
    const page = paginationDto.page || 1;
    const count = this.prismaService.room.count();
    const rooms = this.prismaService.room.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { count, rooms };
  }

  public async getRoomById(id: string) {
    return await this.prismaService.room.findUnique({
      where: { id },
      select: prismaRoomSelect,
    });
  }

  public async queryRoom(name: string) {
    return await this.prismaService.room.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  public async createRoom(roomDto: CreateRoomDto) {
    const room = await this.prismaService.room.create({ data: roomDto });
    return room;
  }
  public async updateRoom(roomId: string, roomDto: UpdateRoomDto) {
    const updated = await this.prismaService.room.update({
      where: { id: roomId },
      data: roomDto,
    });
    return updated;
  }
  public async deleteRoom(roomId: string) {
    await this.prismaService.room.delete({ where: { id: roomId } });
  }

  public async addMessage(roomId: string, userId: string, message: string) {
    return await this.prismaService.room.update({
      where: { id: roomId },
      data: {
        messages: {
          create: { userId, text: message },
        },
      },
      select: prismaRoomSelect,
    });
  }

  public async getMessagesOfRoom(
    roomId: string,
    paginationDto?: PaginationDto,
  ) {
    const room = await this.prismaService.room.findUnique({
      where: { id: roomId },
      select: { messages: true },
    });
    const messages = room.messages;
    const len = messages.length;
    const limit = paginationDto?.limit || 25;
    const page = paginationDto?.page || 1;

    if (len <= limit) return { count: len, messages };

    const offset = (page - 1) * limit;
    messages.splice(0, offset); // remove offset items from original array
    return messages.slice(0, limit); // get only first limit item
  }
}
