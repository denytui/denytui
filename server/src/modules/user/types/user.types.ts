import { RoleType } from '@prisma/client';

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export interface UserOutput {
  id: string;
  username: string;
  email: string;
  role: RoleType;
  active: boolean;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}
