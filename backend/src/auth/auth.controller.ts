import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './admin-auth.guard';
import type { AuthenticatedRequest } from './admin-auth.guard';
import { Req, UseGuards } from '@nestjs/common';

const SESSION_COOKIE = 'destination_session';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.authenticate(body.email, body.password);
    response.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite:
        this.config.get('NODE_ENV') === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 8 * 60 * 60 * 1000,
    });
    return { email: body.email.trim().toLowerCase() };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite:
        this.config.get('NODE_ENV') === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return { success: true };
  }

  @Get('me')
  @UseGuards(AdminAuthGuard)
  async me(@Req() request: AuthenticatedRequest) {
    const admin = await this.authService.getAdmin(request.admin.email);
    if (!admin) throw new UnauthorizedException('Admin account no longer exists.');
    return admin;
  }
}
