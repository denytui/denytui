import { AuthModule } from '@modules/auth/auth.module';
import { GroupModule } from '@modules/group/group.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { PrismaModule } from './providers/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, GroupModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
