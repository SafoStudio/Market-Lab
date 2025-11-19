import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { SessionUser } from "@auth/types/auth.type";

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Extract the JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Do not ignore the expiration date of the JWT
      ignoreExpiration: false,
      // Use the secret key from the environment variables to verify the JWT
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Validate method to verify the JWT payload
  async validate(payload: SessionUser): Promise<SessionUser> {
    // Return the payload if the JWT is valid
    return payload;
  }
}