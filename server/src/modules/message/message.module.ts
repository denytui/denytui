import { Module } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [],
  providers: [PrismaService, MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
