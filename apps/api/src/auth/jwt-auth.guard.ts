import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/** Vérifie le jeton Bearer et place `{ sub, email, role }` sur `req.user`. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const auth: string | undefined = request.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('missing_token');
    }
    try {
      const payload = this.jwt.verify(auth.slice(7), {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('invalid_token');
    }
  }
}
