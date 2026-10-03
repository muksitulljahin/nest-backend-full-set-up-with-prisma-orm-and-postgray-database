import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // process.env (not env()) so `prisma generate` works without a DB URL,
    // e.g. on CI or fresh installs. migrate/studio still need DATABASE_URL set.
    url: process.env.DATABASE_URL ?? '',
  },
});
