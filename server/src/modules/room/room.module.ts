import { Module } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RoomService } from './room.service';

@Module({
  imports: [],
  providers: [PrismaService, RoomService],
})
export class RoomModule {}
