import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

export type AuthenticatedRequest = Request & {
  admin: { sub: string; email: string };
};

function readCookie(request: Request, name: string): string | undefined {
  const cookie = request.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!cookie) return undefined;
  try {
    return decodeURIComponent(cookie.slice(name.length + 1));
  } catch {
    return undefined;
  }
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const origin = request.headers.origin;
    const allowedOrigins = (this.config.get('FRONTEND_URL') ?? 'http://localhost:3000')
      .split(',')
      .map((value: string) => value.trim());
    if (origin && !allowedOrigins.includes(origin)) {
      throw new UnauthorizedException('Request origin is not allowed.');
    }
    const session = this.authService.verifySession(
      readCookie(request, 'destination_session'),
    );
    if (!session || session.role !== 'admin') {
      throw new UnauthorizedException('Please log in to continue.');
    }
    request.admin = { sub: session.sub, email: session.email };
    return true;
  }
}
