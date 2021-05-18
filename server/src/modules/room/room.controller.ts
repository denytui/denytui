import { JwtAuth } from '@modules/auth/guards/jwt.guard';
import {
  Body,
  Controller,
  Param,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PaginationDto, UserFromRequest } from 'src/commons/types';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { RoomService } from './room.service';

@Controller('rooms')
@JwtAuth()
export class RoomController {
  constructor(private roomService: RoomService) {}

  public async rooms(
    @Query('limit') limit?: number,
    @Query('p') page?: number,
  ) {
    const safeLimit = parseInt(limit.toString()) || 25;
    const safePage = parseInt(page.toString()) || 1;
    const pagination: PaginationDto = {
      limit: safeLimit,
      page: safePage,
    };

    return await this.roomService.getRooms(pagination);
  }

  public async roomById(@Param('id') id: string) {
    return await this.roomService.getRoomById(id);
  }

  public async createRoom(@Body() roomDto: CreateRoomDto) {
    return await this.roomService.createRoom(roomDto);
  }

  public async updateRoom(
    @Body() roomDto: UpdateRoomDto,
    @Param('id') id: string,
  ) {
    return await this.roomService.updateRoom(id, roomDto);
  }

  public async deleteRoom(@Param('id') id: string) {
    try {
      await this.roomService.deleteRoom(id);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  public async messagesByRoom(
    @Param('roomId') roomId: string,
    @Query('limit') limit?: number,
    @Query('p') page?: number,
  ) {
    const safeLimit = parseInt(limit.toString()) || 25;
    const safePage = parseInt(page.toString()) || 1;
    const pagination: PaginationDto = {
      limit: safeLimit,
      page: safePage,
    };
    return await this.roomService.messagesOfRoom(roomId, pagination);
  }
}
