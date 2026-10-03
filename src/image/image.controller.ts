import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { successHandler } from 'src/utlis/Handler/successHandler';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        caption: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: Image })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('caption') caption: string,
    @Res() res: Response,
  ) {
    const result = await this.imageService.create(file, caption);
    return successHandler({
      res,
      statusCode: HttpStatus.CREATED,
      message: 'Image uploaded successfully',
      data: result,
    });
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all images' })
  @ApiResponse({ status: 200, type: [Image] })
  async findAll(@Res() res: Response) {
    const result = await this.imageService.findAll();
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Images retrieved successfully',
      data: result,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an image by ID' })
  @ApiResponse({ status: 200, type: Image })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.imageService.findOne(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Image retrieved successfully',
      data: result,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.imageService.remove(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Image deleted successfully',
      data: null,
    });
  }
}
