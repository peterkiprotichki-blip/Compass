import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password?: string; language?: string; country?: string },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password?: string; channel?: 'email' | 'sms' }) {
    return this.authService.login(body.email, body.password, body.channel || 'email');
  }

  @Post('verify-2fa')
  async verify2FA(@Body() body: { userId: string; otp: string }) {
    return this.authService.verify2FA(body.userId, body.otp);
  }

  @Post('resend-2fa')
  async resend2FA(@Body() body: { userId: string; channel?: 'email' | 'sms' }) {
    return this.authService.resend2FA(body.userId, body.channel || 'email');
  }

  @Post('google')
  async loginGoogle(
    @Body() body: { googleId: string; email: string; name: string; avatarUrl?: string },
  ) {
    return this.authService.loginWithGoogle(body);
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }

  @Post('save-path')
  async toggleSavedPath(@Body() body: { userId: string; businessSlug: string }) {
    return this.authService.toggleSavedPath(body.userId, body.businessSlug);
  }
}
