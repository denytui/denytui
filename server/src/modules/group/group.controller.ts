import { JwtAuth } from '@modules/auth/guards/jwt.guard';
import { Body, Controller, Param, Query } from '@nestjs/common';
import { PaginationDto } from 'src/commons/types';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';

@Controller('groups')
@JwtAuth()
export class GroupController {
  constructor(private groupService: GroupService) {}

  public async groups(
    @Query('limit') limit?: number,
    @Query('p') page?: number,
  ) {
    const safeLimit = parseInt(limit.toString()) || 25;
    const safePage = parseInt(page.toString()) || 1;
    const pagination: PaginationDto = {
      limit: safeLimit,
      page: safePage,
    };

    return await this.groupService.getGroups(pagination);
  }

  public async groupById(@Param('id') id: string) {
    return await this.groupService.getGroupById(id);
  }

  public async createGroup(@Body() groupDto: CreateGroupDto) {
    return await this.groupService.createGroup(groupDto);
  }

  public async updateGroup(
    @Body() groupDto: UpdateGroupDto,
    @Param('id') id: string,
  ) {
    return await this.groupService.updateGroup(id, groupDto);
  }

  public async deleteGroup(@Param('id') id: string) {
    try {
      await this.groupService.deleteGroup(id);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  public async messagesByGroup(
    @Param('groupId') groupId: string,
    @Query('limit') limit?: number,
    @Query('p') page?: number,
  ) {
    const safeLimit = parseInt(limit.toString()) || 25;
    const safePage = parseInt(page.toString()) || 1;
    const pagination: PaginationDto = {
      limit: safeLimit,
      page: safePage,
    };
    return await this.groupService.messagesOfGroup(groupId, pagination);
  }
}
