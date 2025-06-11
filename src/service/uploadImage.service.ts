import { createWriteStream, statSync } from 'fs';
import path from 'path';
export interface ImageFile {
  filename: string;
  mimetype: string;
  encoding: string;
  url: string;
  size: number;
}
export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}


export interface PostInterface {
  file: Promise<FileUpload>;
}

class ImageUploadService {
  public static async uploadImage(payload: PostInterface): Promise<ImageFile> {
    const { file } = payload;
    const { createReadStream, filename, mimetype, encoding } = await file;

    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(uploadDir, filename);

    const stream = createReadStream();
    const writeStream = createWriteStream(filePath);

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(writeStream)
        .on('finish', () => resolve())
        .on('error', (err) => reject(err));
    });

    // ✅ Get actual file size
    const size = statSync(filePath).size;

    return {
      filename,
      mimetype,
      encoding,
      url: `/uploads/${filename}`,
      size,
    };
  }
}

export default ImageUploadService;
