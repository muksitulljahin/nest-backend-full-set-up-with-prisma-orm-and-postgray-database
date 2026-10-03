import { Model } from 'mongoose';
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
 * Globally verify OTP against a Mongoose model.
 */
export const globalVerifyOtp = async <T>(
  model: Model<T>,
  otp: string,
): Promise<any> => {
  return await model.findOne({
    'otp.code': otp,
    'otp.expiresAt': { $gt: new Date() },
  });
};
