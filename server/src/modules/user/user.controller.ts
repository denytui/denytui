import { RoleType } from '.prisma/client';
import { JwtAuth } from '@modules/auth/guards/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { PaginationDto } from 'src/commons/types';
import { AddFriendDto } from './dto/add-friend.dto';
import { UserService } from './user.service';

@Controller('users')
@JwtAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  public async users(
    @Query('name') name?: string,
    @Query('limit') limit?: number,
    @Query('p') p?: number,
  ) {
    // Query normally all users with pagination
    if (!name) {
      const safeLimit = parseInt(limit.toString()) || 25;
      const safePage = parseInt(p.toString()) || 1;
      const pagination: PaginationDto = {
        limit: safeLimit,
        page: safePage,
      };

      return await this.userService.getUsers(pagination);
    }

    // Query by username or email
    return await this.userService.getUsersByName(name);
  }

  //-----------------------
  // friend relations
  @Get(':id/friends')
  public async friendsList(
    @Param('id') id: string,
    @Query('name') queryName?: string,
    @Query('limit') limit?: number,
    @Query('p') page?: number,
  ) {
    const friends = await this.userService.getFriends(id, queryName, {
      limit,
      page,
    });
    return friends;
  }

  @Post(':id/friends')
  public async addFriend(
    @Param('id') userId: string,
    @Body() friendDto: AddFriendDto,
  ): Promise<{ added: boolean }> {
    const result = await this.userService.addFriend(userId, friendDto.friendId);
    return result;
  }

  @Delete(':id/friends/:friendId')
  public async deleteFriend(
    @Param('id') userId: string,
    @Param('friendId') friendId: string,
  ): Promise<{ deleted: boolean }> {
    const result = await this.userService.removeFriend(userId, friendId);
    return result;
  }
}
