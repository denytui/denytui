import { AuthModule } from '@modules/auth/auth.module';
import { GroupModule } from '@modules/group/group.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, GroupModule],
  providers: [],
})
export class ChatModule {}
