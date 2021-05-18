import { RoleType } from '.prisma/client';
import { JwtAuth } from '@modules/auth/guards/jwt.guard';
import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from 'src/commons/types';
import { UserService } from './user.service';

@Controller('users')
@JwtAuth(RoleType.ADMIN)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public async users(@Query('limit') limit?: number, @Query('p') p?: number) {
    const safeLimit = parseInt(limit.toString()) || 25;
    const safePage = parseInt(p.toString()) || 1;
    const pagination: PaginationDto = {
      limit: safeLimit,
      page: safePage,
    };

    return await this.userService.getUsers(pagination);
  }
}
