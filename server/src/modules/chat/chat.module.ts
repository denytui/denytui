import { GroupModule } from '@modules/group/group.module';
import { MessageModule } from '@modules/message/message.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ChatGateWay } from './chat.gateway';

@Module({
  imports: [GroupModule, UserModule, MessageModule],
  providers: [ChatGateWay],
})
export class ChatModule {}
