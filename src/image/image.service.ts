import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { Image } from './entities/image.entity';
import { deleteFromR2, uploadToR2 } from 'src/utlis/cloudflare/r2Storage';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(file: Express.Multer.File, caption?: string): Promise<Image> {
    try {
      console.log(
        `[ImageService] Starting upload for file: ${file.originalname} (${file.size} bytes)`,
      );

      // 1. Upload to R2
      const uploadResult = await uploadToR2(file, 'properties');
      console.log(`[ImageService] Uploaded to R2: ${uploadResult.key}`);

      // 2. Save metadata to DB
      const savedImage = await this.prisma.image.create({
        data: {
          url: uploadResult.url,
          key: uploadResult.key,
          filename: uploadResult.filename,
          mimeType: uploadResult.mimetype,
          size: uploadResult.filesize,
          caption: caption,
          uploadedAt: new Date(),
        },
      });

      console.log(
        `[ImageService] Saved image metadata to DB: ${savedImage.id}`,
      );
      return savedImage;
    } catch (error) {
      console.error('Image creation failed:', error);
      throw new InternalServerErrorException('Failed to upload and save image');
    }
  }

  async findAll(): Promise<Image[]> {
    return this.prisma.image.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string): Promise<Image> {
    const image = await this.prisma.image.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);

    // 1. Delete from R2
    if (image.key) {
      await deleteFromR2(image.key);
    }

    // 2. Delete from DB
    await this.prisma.image.delete({ where: { id } });
  }
}
