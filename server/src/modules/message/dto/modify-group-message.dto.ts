import { IsString } from 'class-validator';

export class ModifyGroupMessageDto {
  @IsString()
  content: string;
}
