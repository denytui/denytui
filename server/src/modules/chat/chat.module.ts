import { AuthModule } from '@modules/auth/auth.module';
import { RoomModule } from '@modules/room/room.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, RoomModule],
  providers: [],
})
export class ChatModule {}
