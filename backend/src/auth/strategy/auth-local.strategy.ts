import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SessionUser } from '@auth/types/auth.type';

@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<SessionUser> {
    const user = await this.authService.validateUser({ email, password });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      name: user.firstName ? `${user.firstName} ${user.lastName}`.trim() : undefined,
    };
  }
}