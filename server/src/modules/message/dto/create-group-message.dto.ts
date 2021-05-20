import { ContentType } from '.prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  groupId: string;

  @IsString()
  @IsOptional()
  type?: ContentType;
}
