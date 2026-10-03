import { ApiProperty } from '@nestjs/swagger';
import type { Image as PrismaImage } from 'src/generated/prisma/client';

/**
 * Swagger response shape for an Image row.
 * DB model lives in prisma/schema.prisma (model Image).
 */
export class Image implements PrismaImage {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  key: string;

  @ApiProperty({ nullable: true })
  filename: string | null;

  @ApiProperty({ nullable: true })
  caption: string | null;

  @ApiProperty({ nullable: true })
  mimeType: string | null;

  @ApiProperty({ nullable: true })
  size: number | null;

  @ApiProperty({ nullable: true })
  uploadedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
