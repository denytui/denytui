import { ContentType } from '.prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFriendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  friendId: string;

  @IsString()
  @IsOptional()
  type?: ContentType;
}
