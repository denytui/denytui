import { emailRegex } from '@common/types/user.types';
import { User } from '@prisma/client';
import { ValidatorConstraint, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { PrismaService } from 'src/providers/prisma.service';
import { injectable } from 'tsyringe';

@ValidatorConstraint({ name: 'user', async: true })
@injectable()
export class UserExitsValidator implements ValidatorConstraintInterface {
  constructor(private readonly prismaService: PrismaService) {}

  public async validate(usernameOrEmail: string, _args: ValidationArguments) {
    const isEmail = emailRegex.test(usernameOrEmail);

    let check: User;
    if (isEmail) {
      check = await this.prismaService.client.user.findUnique({ where: { email: usernameOrEmail } });
    } else {
      check = await this.prismaService.client.user.findUnique({ where: { username: usernameOrEmail } });
    }
    // if user exist --> return false: can not validate
    if (check) return false;

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'User with $property $value already exists';
  }
}
