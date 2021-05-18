import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { UserExitsValidator } from 'src/commons/decorators/user-exists.validator';

export class RegisterUserDto {
  @IsString()
  @Matches(/[a-zA-Z0-9_\.-]{2,30}/)
  @Validate(UserExitsValidator)
  username!: string;

  @Validate(UserExitsValidator)
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  password!: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
