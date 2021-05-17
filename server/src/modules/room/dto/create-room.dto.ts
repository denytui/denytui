import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isUser?: boolean;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}
