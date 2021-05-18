import { RoleType, User } from '@prisma/client';
import { UserFromRequest } from 'src/commons/types';

export function mapUserPayload(user: User): UserFromRequest {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role as RoleType,
  };
}
