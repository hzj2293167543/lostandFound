import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UploadService } from './upload.service';
import { UploadTypeDto, MimeSchemas } from '@lostfound/shared';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('type') type: UploadTypeDto) {
    console.log(MimeSchemas);
    if (!MimeSchemas[type].safeParse(file.mimetype).success) {
      throw new BadRequestException('文件类型不支持');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('文件大小不能超过 5MB');
    }
    return await this.uploadService.saveFile(file, type);
  }
}
