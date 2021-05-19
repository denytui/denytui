import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './assets/upload',
        filename: (req, file, cb) => {
          const randomName = String(Math.random()).slice(2, 8);
          const fileName = randomName + '-' + file.originalname;
          return cb(null, fileName);
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class FileModule {}
