import { RoleType, User } from '@prisma/client';
import { UserOutput } from '../types/user.types';

export function mapUserOutput(user: User): UserOutput {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role as RoleType,
    active: user.active,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
