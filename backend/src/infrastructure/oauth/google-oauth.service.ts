import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new OAuth2Client({
      clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
    });
  }

  // Verify Google ID token and get user info
  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload) throw new BadRequestException('Invalid Google token');

      return {
        id: payload.sub,
        email: payload.email!,
        verified_email: payload.email_verified || false,
        name: payload.name || '',
        given_name: payload.given_name || '',
        family_name: payload.family_name || '',
        picture: payload.picture || '',
        locale: payload.locale || 'en',
      };
    } catch (error) {
      throw new BadRequestException(`Google token verification failed: ${error.message}`);
    }
  }

  // Get Google OAuth URL for frontend redirection
  getAuthUrl(): string {
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

    return `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri!)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=offline&` +
      `prompt=consent`;
  }

  // Exchange authorization code for tokens
  async getTokens(code: string): Promise<{
    idToken: string;
    accessToken: string;
    refreshToken?: string | null
  }> {
    try {
      const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');

      const { tokens } = await this.client.getToken({
        code,
        redirect_uri: redirectUri,
      });

      if (!tokens.id_token) throw new BadRequestException('No ID token received from Google');

      return {
        idToken: tokens.id_token,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get Google tokens: ${error.message}`);
    }
  }
}