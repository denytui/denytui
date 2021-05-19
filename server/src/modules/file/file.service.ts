import { Injectable } from '@nestjs/common';
import path from 'path';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class FileService {
  public assetDir: string;
  constructor(private prismaService: PrismaService) {
    this.assetDir = path.join(__dirname + 'assets');
  }

  public async saveFileRecord(userId: string, fileName: string) {
    return await this.prismaService.file.create({
      data: {
        fileName,
        user: { connect: { id: userId } },
      },
    });
  }
}
