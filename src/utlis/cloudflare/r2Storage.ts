// utils/cloudflare/r2Storage.ts
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { ErrorHandler } from '../Handler/errorHandler.js';
import { HttpStatus } from 'http-status-string';
import { v4 as uuidv4 } from 'uuid';
import envConfig from 'src/config/config';

export interface R2UploadResult {
  url: string;
  key: string;
  filename: string;
  filesize: number;
  mimetype: string;
}

// Initialize S3 client for R2
const getR2Client = (): S3Client => {
  const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT } = envConfig;

  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
    throw new ErrorHandler(
      HttpStatus.INTERNAL_SERVER_ERROR_500,
      'R2 configuration missing. Please set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_ENDPOINT',
    );
  }

  return new S3Client({
    region: 'auto', // R2 uses 'auto' for region
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
};

/**
 * Upload file to Cloudflare R2
 * @param file - Multer file object
 * @param folder - Optional folder path in bucket (e.g., 'tickets', 'faq/categories')
 * @returns R2 upload result with public URL
 */
export const uploadToR2 = async (
  file: Express.Multer.File,
  folder: string = 'uploads',
): Promise<R2UploadResult> => {
  try {
    const { R2_BUCKET_NAME, R2_PUBLIC_URL } = envConfig;

    if (!R2_BUCKET_NAME) {
      throw new ErrorHandler(
        HttpStatus.INTERNAL_SERVER_ERROR_500,
        'R2_BUCKET_NAME not configured',
      );
    }

    const client = getR2Client();

    // Generate unique key for the file
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const key = `${folder}/${uniqueFilename}`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    };

    const command = new PutObjectCommand(uploadParams);
    await client.send(command);

    // Generate public URL
    const baseUrl = R2_PUBLIC_URL?.endsWith('/')
      ? R2_PUBLIC_URL.slice(0, -1)
      : R2_PUBLIC_URL;
    const normalizedKey = key.startsWith('/') ? key.slice(1) : key;

    const publicUrl = R2_PUBLIC_URL
      ? `${baseUrl}/${normalizedKey}`
      : `https://${R2_BUCKET_NAME}.r2.dev/${normalizedKey}`;

    return {
      url: publicUrl,
      key,
      filename: file.originalname,
      filesize: file.size,
      mimetype: file.mimetype,
    };
  } catch (error: any) {
    if (error instanceof ErrorHandler) throw error;

    console.error('R2 upload error:', error.message);

    throw new ErrorHandler(
      HttpStatus.INTERNAL_SERVER_ERROR_500,
      error.message || 'Failed to upload file to R2',
    );
  }
};

/**
 * Delete file from Cloudflare R2
 * @param key - R2 object key
 */
export const deleteFromR2 = async (key: string): Promise<void> => {
  try {
    const { R2_BUCKET_NAME } = envConfig;

    if (!R2_BUCKET_NAME) {
      console.warn('R2_BUCKET_NAME not configured, skipping deletion');
      return;
    }

    const client = getR2Client();

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await client.send(command);
  } catch (error: any) {
    console.error('R2 deletion error:', error.message);
    // Don't throw error for deletion failures
  }
};

/**
 * Upload multiple files to Cloudflare R2
 * @param files - Array of Multer file objects
 * @param folder - Optional folder path in bucket
 * @returns Array of R2 upload results
 */
export const uploadMultipleToR2 = async (
  files: Express.Multer.File[],
  folder: string = 'uploads',
): Promise<R2UploadResult[]> => {
  const uploadPromises = files.map((file) => uploadToR2(file, folder));
  return await Promise.all(uploadPromises);
};
