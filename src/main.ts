import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './libs/prisma/prisma-exception.filter';
import basicAuth from 'express-basic-auth';
import envConfig from './config/config';

// import * as dns from 'dns';

// dns.setServers(['1.1.1.1']);

async function main() {
  try {
    const app = await NestFactory.create(AppModule);
    app.getHttpAdapter().getInstance().set('trust proxy', true);

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.use(
      ['/api-docs'],
      basicAuth({
        challenge: true,
        users: {
          [envConfig.SWAGGER_USER]: envConfig.SWAGGER_PASSWORD,
        },
      }),
    );

    const origin =
      envConfig.NODE_ENV === 'development'
        ? ['http://localhost:3000', 'http://localhost:3001']
        : ['http://localhost:3000', 'http://localhost:3001'];

    app.enableCors({
      origin: origin,
      credentials: true,
    });

    // Map Prisma errors (duplicate, not found, FK) to HTTP responses
    app.useGlobalFilters(new PrismaExceptionFilter());

    const swaggerConfig = new DocumentBuilder()
      .setTitle('setup API')
      .setDescription('The Basiraan backend API description')
      .setVersion('1.0.0')
      .addTag('setup')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(envConfig.PORT, () => {
      Logger.log(`Server is running at http://localhost:${envConfig.PORT}`);
    });

  } catch (error) {
    Logger.error(error);
  }
}
main();
