import envConfig from 'src/config/config';

/**
 * Generates a 6-digit OTP.
 * Returns '123456' in development mode.
 */
export const generateOtp = (): string => {
  return envConfig.NODE_ENV === 'development'
    ? '123456'
    : Math.floor(100000 + Math.random() * 900000).toString();
};

// export const generateOtp = (): string => {
//   return '123456';
// };

/**
 * Any Prisma model delegate (e.g. `prisma.user`) that supports findFirst.
 */
type FindFirstDelegate = {
  findFirst(args: any): Promise<any>;
};

/**
 * Globally verify OTP against a Prisma model.
 * The model must have `otpCode` (String) and `otpExpiresAt` (DateTime) columns.
 *
 * @example globalVerifyOtp(this.prisma.user, otp)
 */
export const globalVerifyOtp = async (
  model: FindFirstDelegate,
  otp: string,
): Promise<any> => {
  return await model.findFirst({
    where: {
      otpCode: otp,
      otpExpiresAt: { gt: new Date() },
    },
  });
};
