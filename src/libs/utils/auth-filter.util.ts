import { BadRequestException } from '@nestjs/common';

/**
 * Generates an $or filter for MongoDB queries based on email or phoneNumber.
 * @param email - The user's email address
 * @param phoneNumber - The user's phone number
 * @returns An array for the $or operator
 */
export const getAuthIdentifierFilter = (
  email?: string,
  phoneNumber?: string,
) => {
  if (!email && !phoneNumber) {
    throw new BadRequestException('Email or Phone number is required');
  }

  const orFilter: any[] = [];
  if (email) orFilter.push({ email });
  if (phoneNumber) orFilter.push({ phoneNumber });

  return orFilter;
};
