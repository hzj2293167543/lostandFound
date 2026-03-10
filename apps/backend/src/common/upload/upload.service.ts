import { UploadTypeDto } from '@lostfound/shared';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream } from 'fs';
import { ensureDir } from 'fs-extra';
import { join } from 'path';
import { v4 as uuIdv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}
  async saveFile(file: Express.Multer.File, type: UploadTypeDto): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const fileName = `${uuIdv4()}.${ext}`;
    const uploadRoot =
      this.configService.get('upload.directory') || join(__dirname, '..', '..', 'uploads');

    const typeDir = join(uploadRoot, type);
    await ensureDir(typeDir);

    const filePath = join(typeDir, fileName);

    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.write(file.buffer);
      writeStream.end();
      writeStream.on('finish', () => {
        resolve(filePath);
      });
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
    const baseUrl = this.configService.get('app.baseUrl') || 'http://localhost:3000';
    return `${baseUrl}/uploads/${type}/${fileName}`;
  }
}
