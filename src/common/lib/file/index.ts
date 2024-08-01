import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';

export function createFileUploadOption(
  mimetype: any,
  fileSize: number,
  maxFileAtTime: number,
) {
  const imgUploadOptions: MulterOptions = {
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(mimetype)) {
        // Allow storage of file
        cb(null, true);
      } else {
        // Reject file
        cb(
          new BadRequestException(
            'Unsupported file type' + extname(file.originalname),
          ),
          false,
        );
      }
    },

    limits: {
      fileSize: fileSize, // max file size
      files: maxFileAtTime, // max of five files at a time
    },
  };
  return imgUploadOptions;
}
