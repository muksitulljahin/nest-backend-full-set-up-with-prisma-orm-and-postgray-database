import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';

/**
 * Maps common Prisma errors to HTTP responses.
 * Replaces the old Mongoose `enforceUniqueField` helper:
 * add `@unique` in schema.prisma and duplicates return 409 here.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    switch (exception.code) {
      // Unique constraint failed
      case 'P2002': {
        const target = (exception.meta?.target as string[] | undefined)?.join(
          ', ',
        );
        return res.status(HttpStatus.CONFLICT).json({
          success: false,
          statusCode: HttpStatus.CONFLICT,
          message: `Duplicate value for unique field: ${target ?? 'unknown'}`,
        });
      }
      // Record not found
      case 'P2025':
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
        });
      // Foreign key constraint failed
      case 'P2003':
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Related record does not exist',
        });
      default:
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
        });
    }
  }
}
