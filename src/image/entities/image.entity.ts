import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Image extends Document {
  @ApiProperty()
  @Prop({ required: true })
  url: string;

  @ApiProperty()
  @Prop({ required: true })
  key: string;

  @ApiProperty()
  @Prop()
  filename: string;

  @ApiProperty()
  @Prop()
  caption: string;

  @ApiProperty()
  @Prop()
  mimeType: string;

  @ApiProperty()
  @Prop()
  size: number;

  @ApiProperty()
  @Prop()
  uploadedAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
