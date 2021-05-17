import { Module } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [PrismaService, UserService],
})
export class UserModule {}
