import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { PaginationDto } from 'src/commons/types';
import { CreateRoomDto } from './dto';
import { RoomService } from './room.service';

@Controller()
export class RoomController {
  constructor(private roomService: RoomService) {}

  public async rooms(
    @Query('limit') limit?: number,
    @Query('p') page?: number,
  ) {
    const safeLimit = parseInt(limit.toString()) || 25;
    const safePage = parseInt(p.toString()) || 1;
    const pagination: PaginationDto = {
      limit: safeLimit,
      page: safePage,
    };

    return await this.roomService.getRooms(pagination);
  }

  public async roomById(@Param('id') id: string) {
    return await this.roomService.getRoomById(id);
  }

  public async createRoom(@Body() roomDto: CreateRoomDto) {}
}
