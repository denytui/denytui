import { Module } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { GroupService } from './group.service';

@Module({
  imports: [],
  providers: [PrismaService, GroupService],
})
export class GroupModule {}
