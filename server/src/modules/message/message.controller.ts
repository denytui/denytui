import { ContentType } from '.prisma/client';
import { JwtAuth } from '@modules/auth/guards/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  CreateFriendMessageDto,
  CreateGroupMessageDto,
  ModifyFriendMessageDto,
} from './dto';
import { ModifyGroupMessageDto } from './dto/modify-group-message.dto';
import { MessageService } from './message.service';

@Controller('messages')
@JwtAuth()
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('groups/:groupId')
  public async getGroupMessages(@Param('groupId') groupId: string) {
    return await this.messageService.getGroupMessages(groupId);
  }

  @Get('friends/:friendId')
  public async getFriendMessages(
    @Param('friendId') friendId: string,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    const friendMessages = await this.messageService.getFriendMessages(
      user.id,
      friendId,
    );

    return friendMessages;
  }

  @Post('friends')
  public async sendMessageToFriend(
    @Body() messageDto: CreateFriendMessageDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    const { friendId, content } = messageDto;
    const type = (messageDto.type as ContentType) || ContentType.TEXT;
    return await this.messageService.sendMessageToFriend(
      user.id,
      friendId,
      content,
      type,
    );
  }

  @Post('groups')
  public async sendMessageToGroup(
    @Body() messageDto: CreateGroupMessageDto,
    @Req() req: Request,
  ) {
    const { groupId, content } = messageDto;
    const type = messageDto.type || ContentType.TEXT;
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    return await this.messageService.sendMessageToGroup(
      user.id,
      groupId,
      content,
      type,
    );
  }

  @Put('friend-messages/:id')
  public async modifyFriendMessage(
    @Body() messageDto: ModifyFriendMessageDto,
    @Param('id') id: string,
  ) {
    return await this.messageService.modifyFriendMessage(id, messageDto);
  }

  @Put('group-messages/:id')
  public async modifyGroupMessage(
    @Body() messageDto: ModifyGroupMessageDto,
    @Param('id') groupMessageId: string,
  ) {
    return await this.messageService.modifyGroupMessage(
      groupMessageId,
      messageDto,
    );
  }

  @Delete('friend-messages/:id')
  public async deleteFriendMessage(
    @Param('id') friendMessageId: string,
    @Req() req: Request,
  ) {
    const { user } = req;
    if (!user) throw new UnauthorizedException();
    return await this.messageService.deleteFriendMessage(
      user.id,
      friendMessageId,
    );
  }

  @Delete('group-messages/:id')
  public async deleteGroupMessage(
    @Param('id') groupMessageId: string,
    @Req() req: Request,
  ) {
    const { user } = req;
    if (!user) throw new UnauthorizedException();
    return await this.messageService.deleteGroupMessage(
      user.id,
      groupMessageId,
    );
  }
}
