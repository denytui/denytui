import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  groupName?: string;

  @IsString()
  @IsOptional()
  intro?: string;

  @IsBoolean()
  @IsOptional()
  avatar?: string;
}
