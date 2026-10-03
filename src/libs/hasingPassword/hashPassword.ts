import * as bcrypt from 'bcryptjs';

// 1. Password Hashing Function
/**
 * Hashes a plain text password using bcrypt.
 * @param plainPassword The password string to be hashed.
 * @returns A Promise that resolves to the hashed password string, or void/undefined on error.
 */
export const hashPassword = async (
  plainPassword: string,
): Promise<string | undefined> => {
  const saltRounds: number = 10;

  try {
    // ⚠️ Note: bcrypt is a CommonJS module, so using 'import * as bcrypt from...'
    // is best practice to avoid 'unsafe' TypeScript/ESLint warnings.
    const hashedPassword: string = await bcrypt.hash(plainPassword, saltRounds);

    // In a production environment, you should avoid logging passwords (even hashed ones)
    // to the console unless absolutely necessary for debugging.
    console.log('Hashed password:', hashedPassword);

    return hashedPassword;
  } catch (err) {
    // You should typically re-throw an error or handle it more robustly than just logging.
    console.error('Error hashing password:', err);
    // Returning undefined/void ensures type safety if the promise resolves but fails.
    return undefined;
  }
};

// 2. Password Comparison Function
/**
 * Compares a plain text password with a hashed password.
 * @param plainPassword The password string to compare.
 * @param hashedPassword The stored hashed password string.
 * @returns A Promise that resolves to a boolean (true if they match).
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const isMatch: boolean = await bcrypt.compare(
      plainPassword,
      hashedPassword,
    );
    return isMatch;
  } catch (error) {
    // Handling comparison errors (e.g., invalid hash format)
    console.error('Error comparing password:', error);
    // If an error occurs during comparison, assume no match for security.
    return false;
  }
};
