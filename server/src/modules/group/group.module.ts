import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/providers/prisma/prisma.module';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { GroupService } from './group.service';

@Module({
  imports: [PrismaModule],
  providers: [PrismaService, GroupService],
  controllers: [GroupModule],
})
export class GroupModule {}
