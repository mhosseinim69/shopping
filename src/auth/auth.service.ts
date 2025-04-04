import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from '../logger/logger.service';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  private async generateTokens(user: User) {
    const payload = { email: user.email, sub: user.id };

    try {
      const accessToken = this.jwtService.sign(payload, {
        secret:
          this.configService.get('app.jwt.accessSecret') || 'access_secret',
        expiresIn: this.configService.get('app.jwt.accessExpiresIn') || '15m',
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret:
          this.configService.get('app.jwt.refreshSecret') || 'refresh_secret',
        expiresIn: this.configService.get('app.jwt.refreshExpiresIn') || '7d',
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException('Failed to generate tokens');
    }
  }

  private async hashToken(token: string) {
    return await bcrypt.hash(token, 10);
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    try {
      if (await this.usersRepository.findOne({ where: { email } })) {
        throw new EmailAlreadyExistsException(email);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        email,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);

      this.logger.log(`User created: ${email}`);
      return { message: 'User registered successfully' };
    } catch (error) {
      this.logger.error(
        `Registration failed for ${registerDto.email}: ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });
      if (!user) throw new UserNotFoundException(email);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');

      const tokens = await this.generateTokens(user);
      user.refreshToken = await this.hashToken(tokens.refreshToken);
      await this.usersRepository.save(user);

      this.logger.log(`User loged: ${email}`);
      return tokens;
    } catch (error) {
      this.logger.error(`Login failed for ${email}: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Login failed');
    }
  }

  async refreshToken(userId: number, refreshToken: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user || !user.refreshToken)
        throw new UnauthorizedException('Invalid refresh token');

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      const tokens = await this.generateTokens(user);

      user.refreshToken = await this.hashToken(tokens.refreshToken);
      await this.usersRepository.save(user);

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new BadRequestException('Token refresh failed');
    }
  }

  async logout(userId: number) {
    try {
      await this.usersRepository.update(userId, {
        refreshToken: '',
      });

      this.logger.log(`User with ID ${userId} has logged out`);
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new BadRequestException('Logout failed');
    }
  }
}
