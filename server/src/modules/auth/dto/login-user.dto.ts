import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  usernameOrEmail!: string;

  @IsString()
  @MinLength(3)
  password!: string;
}
