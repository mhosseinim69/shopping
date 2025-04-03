import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req) {
    const tokens = await this.authService.login(loginDto);

    req.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { accessToken: tokens.accessToken };
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req) {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.user?.userId;
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const userId = req.user?.userId;
    await this.authService.logout(userId);
    req.res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }
}
