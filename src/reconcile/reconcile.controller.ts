import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ReconcileService } from './reconcile.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('reconcile')
export class ReconcileController {
  constructor(private readonly reconcileService: ReconcileService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sourceA', maxCount: 1 },
        { name: 'sourceB', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${unique}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async reconcile(@UploadedFiles() files: { sourceA?: Express.Multer.File[]; sourceB?: Express.Multer.File[] }) {
    const fileA = files.sourceA?.[0];
    const fileB = files.sourceB?.[0];

    if (!fileA || !fileB) {
      return { error: 'Both sourceA and sourceB files are required.' };
    }

    return this.reconcileService.reconcileFiles(fileA.path, fileB.path);
  }
}
