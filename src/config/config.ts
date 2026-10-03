import 'dotenv/config';

const envConfig = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV as string,
  ENCRYPTED:
    process.env.ENCRYPTED === 'true' ||
    (process.env.NODE_ENV === 'production' &&
      process.env.ENCRYPTED !== 'false'),

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY as string,
  FRONT_ENCRYPTION_KEY: process.env.FRONT_ENCRYPTION_KEY as string,
  DATABASE_URI: process.env.DATABASE_URI as string,
  SWAGGER_USER: process.env.SWAGGER_USER as string,
  SWAGGER_PASSWORD: process.env.SWAGGER_PASSWORD as string,
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL as string,

  SSL_STORE_ID: process.env.SSL_STORE_ID as string,
  SSL_STORE_PASSWORD: process.env.SSL_STORE_PASSWORD as string,
  SSL_IS_LIVE: process.env.SSL_IS_LIVE === 'true',

  BKASH_APP_KEY: process.env.BKASH_APP_KEY as string,
  BKASH_APP_SECRET: process.env.BKASH_APP_SECRET as string,
  BKASH_USERNAME: process.env.BKASH_USERNAME as string,
  BKASH_PASSWORD: process.env.BKASH_PASSWORD as string,
  BKASH_IS_LIVE: process.env.BKASH_IS_LIVE === 'true',

  MRAM_API_KEY: process.env.MRAM_API_KEY as string,
  MRAM_API_SECRET: process.env.MRAM_API_SECRET as string,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  MAILBUX_USER: process.env.MAILBUX_USER as string,
  MAILBUX_PASS: process.env.MAILBUX_PASS as string,
  MAILBUX_FROM_EMAIL: process.env.MAILBUX_FROM_EMAIL as string,
  BREVO_API_KEY: process.env.BREVO_API_KEY as string,
  RESEND_API_KEY: process.env.RESEND_API_KEY as string,
  MAILJET_API_KEY: process.env.MAILJET_API_KEY as string,
  MAILJET_SECRET_KEY: process.env.MAILJET_SECRET_KEY as string,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID as string,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY as string,
  R2_ENDPOINT: process.env.R2_ENDPOINT as string,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME as string,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL as string,

  // Google OAuth 2.0
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
};

export default envConfig;
