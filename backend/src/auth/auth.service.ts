import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Model } from 'mongoose';
import { hashPassword, verifyPassword } from './password.util';
import { Admin } from './schemas/admin.schema';

type SessionPayload = {
  sub: string;
  email: string;
  exp: number;
  role: 'admin';
};

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(@InjectModel(Admin.name) private readonly admins: Model<Admin>) {}

  async onModuleInit() {
    const email = this.configuredAdminEmail();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || password.length < 12) {
      throw new Error(
        'Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.',
      );
    }

    const existing = await this.admins
      .findOne({ email })
      .select('+passwordHash')
      .exec();
    if (!existing) {
      await this.admins.create({
        email,
        passwordHash: await hashPassword(password),
      });
    } else if (!(await verifyPassword(password, existing.passwordHash))) {
      existing.passwordHash = await hashPassword(password);
      await existing.save();
    }
    this.sessionSecret();
  }

  async authenticate(email: string, password: string): Promise<string> {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== this.configuredAdminEmail()) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    const admin = await this.admins
      .findOne({ email: normalizedEmail })
      .select('+passwordHash')
      .exec();
    const matches =
      admin && (await verifyPassword(password, admin.passwordHash));

    if (!admin || !matches) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    return this.createSession(admin.id, admin.email);
  }

  createSession(sub: string, email: string): string {
    const payload: SessionPayload = {
      sub,
      email,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${encoded}.${this.sign(encoded)}`;
  }

  verifySession(token: string | undefined): SessionPayload | null {
    if (!token) return null;
    const [encoded, suppliedSignature] = token.split('.');
    if (!encoded || !suppliedSignature) return null;

    const expected = Buffer.from(this.sign(encoded));
    const supplied = Buffer.from(suppliedSignature);
    if (
      expected.length !== supplied.length ||
      !timingSafeEqual(expected, supplied)
    ) {
      return null;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(encoded, 'base64url').toString('utf8'),
      ) as SessionPayload;
      if (
        typeof payload.sub !== 'string' ||
        typeof payload.email !== 'string' ||
        payload.email !== this.configuredAdminEmail() ||
        typeof payload.exp !== 'number' ||
        payload.role !== 'admin' ||
        payload.exp <= Math.floor(Date.now() / 1000)
      ) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

  async getAdmin(email: string) {
    return this.admins.findOne({ email }).select('email').lean().exec();
  }

  private configuredAdminEmail(): string | undefined {
    return process.env.ADMIN_EMAIL?.trim().toLowerCase();
  }

  private sessionSecret(): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('SESSION_SECRET must contain at least 32 characters.');
    }
    return secret;
  }

  private sign(value: string): string {
    return createHmac('sha256', this.sessionSecret())
      .update(value)
      .digest('base64url');
  }
}
