import { HttpException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  public async hash(plainText: string) {
    return await bcrypt.hash(plainText, 12);
  }

  public async verify(hash: string, plain: string) {
    try {
      return await bcrypt.compare(plain, hash);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
