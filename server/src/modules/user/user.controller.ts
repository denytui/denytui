import { RoleType } from '.prisma/client';
import { JwtAuth } from '@modules/auth/guards/jwt.guard';
import { Controller } from '@nestjs/common';

@Controller()
@JwtAuth(RoleType.ADMIN)
export class UserController {}
