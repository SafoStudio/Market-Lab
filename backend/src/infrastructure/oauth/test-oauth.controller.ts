import { Controller, Get, Res, Query } from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('test-oauth')
export class TestOAuthController {
  constructor(private readonly configService: ConfigService) { }

  @Get('google-setup')
  async testGoogleSetup() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');

    return {
      status: 'Google OAuth Test',
      hasClientId: !!clientId,
      clientIdLength: clientId?.length || 0,
      redirectUri,
      nextSteps: [
        '1. Check if GOOGLE_CLIENT_ID is set',
        '2. Check if GOOGLE_CLIENT_SECRET is set',
        '3. Verify redirect URI matches Google Cloud Console',
        '4. Test endpoint: GET /auth/google/url'
      ]
    };
  }

  @Get('simulate-callback')
  simulateCallback(@Res() res: Response, @Query('code') code: string) {
    // simulate callback from Google
    const redirectUri = this.configService.get<string>('FRONTEND_URL') + '/auth/google/callback';

    if (code) return res.redirect(`${redirectUri}?code=${code}&state=test`);

    return res.send(`
      <h1>Google OAuth Callback Simulation</h1>
      <p>Redirect URI: ${redirectUri}</p>
      <a href="/test-oauth/simulate-callback?code=test-auth-code">Simulate Google Callback with Code</a>
    `);
  }
}