import { UserRole } from '../globalEnum/user-roles.enum';
import { TokenService } from '../JWT/token.service';

/**
 * Common utility function to check if the request is from an admin, super admin, staff, or support.
 * Works with both guarded routes (using req.user) and unguarded/public routes (manually parsing the token).
 */
export async function checkIsAdminRequest(
  req: any,
  tokenService?: TokenService,
): Promise<boolean> {
  if (!req) return false;

  // 1. Check if AuthGuard has already verified and attached the user object
  if (req.user) {
    const role = req.user.role;
    return (
      role === UserRole.ADMIN ||
      role === UserRole.SUPER_ADMIN ||
      role === UserRole.STAFF ||
      role === UserRole.SUPPORT
    );
  }

  // 2. Fallback to manually verify the authorization header if tokenService is provided (useful for public routes)
  const authHeader = req.headers?.authorization;
  if (!authHeader || !tokenService) return false;

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return false;

  try {
    const payload = await tokenService.verifyToken(token);
    const role = payload?.role;
    return (
      role === UserRole.ADMIN ||
      role === UserRole.SUPER_ADMIN ||
      role === UserRole.STAFF ||
      role === UserRole.SUPPORT
    );
  } catch {
    return false;
  }
}
