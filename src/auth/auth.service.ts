import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async generateTokens(user: User) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('app.jwt.accessSecret') || 'access_secret',
      expiresIn: this.configService.get('app.jwt.accessExpiresIn') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get('app.jwt.refreshSecret') || 'refresh_secret',
      expiresIn: this.configService.get('app.jwt.refreshExpiresIn') || '7d',
    });

    return { accessToken, refreshToken };
  }

  private async hashToken(token: string) {
    return await bcrypt.hash(token, 10);
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user);

    user.refreshToken = await this.hashToken(tokens.refreshToken);
    await this.usersRepository.save(user);

    return tokens;
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateTokens(user);

    user.refreshToken = await this.hashToken(tokens.refreshToken);
    await this.usersRepository.save(user);

    return tokens;
  }

  async logout(userId: number) {
    await this.usersRepository.update(userId, {
      refreshToken: '',
    });
    return { message: 'Logged out successfully' };
  }
}
