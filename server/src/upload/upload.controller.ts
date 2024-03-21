import { Controller, Post, UseInterceptors, UploadedFile, Param, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { fileURLToPath } from 'url';

const multerOptions = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
    }),
};


@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
    ) { }

    @Post(":id")
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async uploadFile(@UploadedFile() file, @Param('id') id: string, @Req() request) {
        const imageUrl = request.protocol + '://' + request.get('host') + '/' + file.path;
        await this.uploadService.findAndUpdatPicUrl(id, imageUrl)
        return { message: 'Файл успешно загружен' };
    }

    @Post("stretchImg/:id")
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async uploadStretchFile(@UploadedFile() file, @Param('id') id: string, @Req() request) {
        const imageUrl = request.protocol + '://' + request.get('host') + '/' + file.path;
        await this.uploadService.findAndUpdatStretchPicUrl(id, imageUrl)
        return { message: 'Файл успешно загружен' };
    }
}
