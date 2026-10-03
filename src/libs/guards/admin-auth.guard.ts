import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { TokenService } from 'src/libs/JWT/token.service';
import { UserRole } from 'src/libs/globalEnum/user-roles.enum';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.tokenService.verifyToken(token);

      const isAllowedRole =
        payload?.role === UserRole.ADMIN ||
        payload?.role === UserRole.SUPER_ADMIN ||
        payload?.role === UserRole.STAFF ||
        payload?.role === UserRole.SUPPORT;

      if (!isAllowedRole) {
        throw new ForbiddenException('Access denied. Admin privileges required.');
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
