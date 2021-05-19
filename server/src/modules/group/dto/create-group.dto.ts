import { User } from '.prisma/client';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  groupName!: string;

  @IsString()
  @IsOptional()
  intro?: string;

  @IsBoolean()
  @IsOptional()
  avatar?: string;

  @IsOptional()
  groupManager: User;
}
