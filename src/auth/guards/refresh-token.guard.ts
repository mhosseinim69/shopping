import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class RefreshTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return true;
  }
}
