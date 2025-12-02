import { Controller, Post, Body, HttpCode, Req, Res, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import type { RegisterDto, RegisterInitialDto, RegCompleteDto, RegSupplierProfileDto, AuthRequest, Response } from './types';
import { AuthService } from './auth.service';
import { AuthLocalGuard } from './guard/auth-local.guard';
import { AuthJwtGuard } from './guard/auth-jwt.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('register-initial')
  @HttpCode(201)
  async registerInitial(
    @Body() dto: RegisterInitialDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.auth.registerInitial(dto);

    res.cookie('authToken', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return result;
  }

  @Post('register-complete')
  @UseGuards(AuthJwtGuard)
  @HttpCode(200)
  async completeRegistration(
    @Req() req: AuthRequest,
    @Body() dto: RegCompleteDto,
    @Res({ passthrough: true }) res: Response
  ) {
    if (!req.user) throw new UnauthorizedException();

    const result = await this.auth.completeRegistration(req.user.id, dto);

    res.cookie('authToken', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return result;
  }

  @UseGuards(AuthLocalGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Req() req: AuthRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    if (!req.user) throw new UnauthorizedException();

    const result = await this.auth.login(req.user.id);

    res.cookie('authToken', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return result;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authToken');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthJwtGuard)
  @Get('session/user')
  async getSession(@Req() req: AuthRequest) {
    return req.user || null;
  }

  @UseGuards(AuthJwtGuard)
  @Post('request-supplier')
  async requestSupplier(
    @Req() req: AuthRequest,
    @Body() dto: RegSupplierProfileDto,
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.auth.requestSupplier(req.user.id, dto);
  }

  @UseGuards(AuthJwtGuard)
  @Get('reg-status')
  async getRegistrationStatus(@Req() req: AuthRequest) {
    if (!req.user) throw new UnauthorizedException();

    const user = await this.auth.findByEmail(req.user.email);
    if (!user) throw new UnauthorizedException();

    return {
      regComplete: user.regComplete,
      roles: user.roles,
      emailVerified: user.emailVerified,
    };
  }

  // admin registration endpoint
  @Post('register-admin')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.register(dto);

    res.cookie('authToken', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return result;
  }
}