import { Model } from 'mongoose';

/**
 * Generates a unique, Facebook-style username based on a base string.
 * Checks for existing usernames in the given Mongoose model to guarantee uniqueness.
 */
export async function generateUniqueUsername(
  model: Model<any>,
  baseName: string,
): Promise<string> {
  // Convert to lowercase, replace spaces with dots, keep only alphanumeric and dots
  let cleanName = baseName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '');

  if (!cleanName) {
    cleanName = 'user';
  }

  let username = cleanName;
  let exists = await model.exists({ username });
  if (!exists) {
    return username;
  }

  // If exists, append sequential counters until a unique one is found
  let counter = 1;
  while (exists) {
    username = `${cleanName}.${counter}`;
    exists = await model.exists({ username });
    counter++;
  }

  return username;
}
