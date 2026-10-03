import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import envConfig from 'src/config/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      adapter: new PrismaPg({ connectionString: envConfig.DATABASE_URL }),
    });
  }

  async onModuleInit() {

    try {
      await this.$connect();
      // Test actual database connectivity with a ping query
      await this.$queryRaw`SELECT 1`;
      this.logger.log('PostgreSQL connection successful');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`PostgreSQL connection failed: ${msg}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
