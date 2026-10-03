import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import envConfig from './config/config';

@Module({
  imports: [
    MongooseModule.forRoot(envConfig.DATABASE_URI, {
      dbName: 'data base name',
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
