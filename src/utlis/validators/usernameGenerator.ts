/**
 * Any Prisma model delegate (e.g. `prisma.user`) with a `username` column.
 */
type UsernameDelegate = {
  findFirst(args: any): Promise<any>;
};

const usernameExists = async (
  model: UsernameDelegate,
  username: string,
): Promise<boolean> => {
  const found: unknown = await model.findFirst({
    where: { username },
    select: { id: true },
  });
  return !!found;
};

/**
 * Generates a unique, Facebook-style username based on a base string.
 * Checks for existing usernames in the given Prisma model to guarantee uniqueness.
 *
 * @example generateUniqueUsername(this.prisma.user, 'Jahin Ahmed')
 */
export async function generateUniqueUsername(
  model: UsernameDelegate,
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
  let exists = await usernameExists(model, username);
  if (!exists) {
    return username;
  }

  // If exists, append sequential counters until a unique one is found
  let counter = 1;
  while (exists) {
    username = `${cleanName}.${counter}`;
    exists = await usernameExists(model, username);
    counter++;
  }

  return username;
}
