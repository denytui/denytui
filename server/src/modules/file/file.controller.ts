import { JwtAuth } from '@modules/auth/guards/jwt.guard';
import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { FileService } from './file.service';

@Controller('files')
@JwtAuth()
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@Req() req: Request, @UploadedFile() file: any) {
    const { user } = req.user;
    return this.fileService.saveFileRecord(user.id, file.filename);
  }

  @Get(':name')
  public async display(@Param('name') name: string, @Res() res: Response) {
    res.send(`${process.cwd}/assets/upload/${name}`);
    return name;
  }
}
