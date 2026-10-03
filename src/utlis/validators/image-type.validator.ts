import { FileValidator } from '@nestjs/common';
import 'multer';

/**
 * Custom image type validator that checks file.mimetype directly.
 * Bypasses the file-type magic-bytes library (which can't detect SVG).
 */
export class ImageTypeValidator extends FileValidator<Record<string, never>> {
  private readonly allowed = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml',
  ];

  isValid(file?: Express.Multer.File): boolean {
    if (!file) return true;
    return this.allowed.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return `Invalid file type. Allowed: ${this.allowed.join(', ')}`;
  }
}
