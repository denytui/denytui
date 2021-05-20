import { IsString } from 'class-validator';

export class ModifyFriendMessageDto {
  @IsString()
  content: string;
}
