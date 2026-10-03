import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import envConfig from 'src/config/config';

export interface UserPayload {
  id: string;
  email: string | undefined;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates an access token and a refresh token for a given user.
   */
  async generateToken(user: UserPayload): Promise<TokenPair> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: envConfig.JWT_SECRET_KEY,
        expiresIn: '15d', // 15 days
      } as any),
      this.jwtService.signAsync(payload, {
        secret: envConfig.JWT_SECRET_KEY,
        expiresIn: '3m', // 15 days
      } as any),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Verifies a refresh token and generates a new pair of tokens.
   */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: envConfig.JWT_SECRET_KEY,
      });

      // After 3 days or more, if the refresh token is still valid,
      // we generate a new pair of tokens.
      const user: UserPayload = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };

      return this.generateToken(user);
    } catch (error) {
      // If the refresh token is expired or invalid, throw an error
      // which will trigger "auto logout" on the frontend.
      throw new UnauthorizedException('Session expired. Please log in again.');
    }
  }

  /**
   * Standard token verification
   */
  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: envConfig.JWT_SECRET_KEY,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Generates a short-lived token for password reset.
   */
  async generateResetToken(userId: string, role: string): Promise<string> {
    const payload = {
      sub: userId,
      role: role,
      purpose: 'password_reset',
    };

    return this.jwtService.signAsync(payload, {
      secret: envConfig.JWT_SECRET_KEY,
      expiresIn: '3m', // 3 minutes
    } as any);
  }

  /**
   * Generates a temporary token for incomplete teacher profile registration or appeal flows.
   */
  async generateTempToken(userId: string, role: string): Promise<string> {
    const payload = {
      sub: userId,
      role: role,
      isTemp: true,
    };

    return this.jwtService.signAsync(payload, {
      secret: envConfig.JWT_SECRET_KEY,
      expiresIn: '30d',
    } as any);
  }

  /**
   * Verifies a password reset token.
   */
  async verifyResetToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: envConfig.JWT_SECRET_KEY,
      });

      if (payload.purpose !== 'password_reset') {
        throw new UnauthorizedException('Invalid token purpose');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
}
