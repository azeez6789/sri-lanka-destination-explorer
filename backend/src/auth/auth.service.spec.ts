import { createHmac } from 'node:crypto';
import { Model } from 'mongoose';
import { Admin } from './schemas/admin.schema';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const originalEnvironment = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    secret: process.env.SESSION_SECRET,
  };
  const password = 'TestAdminPassword!2026';
  const email = 'admin@scripterlab.test';
  const sessionSecret = 'test-secret-with-more-than-thirty-two-characters';
  let insertedAdmin: { email: string; passwordHash: string } | undefined;
  let storedAdmin:
    | {
        id: string;
        email: string;
        passwordHash: string;
        save: jest.Mock;
      }
    | undefined;
  let service: AuthService;

  beforeEach(async () => {
    process.env.ADMIN_EMAIL = email;
    process.env.ADMIN_PASSWORD = password;
    process.env.SESSION_SECRET = sessionSecret;

    const model = {
      create: jest.fn(async (admin: { email: string; passwordHash: string }) => {
        storedAdmin = {
          ...admin,
          id: 'admin-id',
          save: jest.fn().mockResolvedValue(undefined),
        };
        insertedAdmin = storedAdmin;
        return storedAdmin;
      }),
      findOne: jest.fn((filter: { email: string }) => ({
        select: () => ({
          exec: async () =>
            filter.email === email ? storedAdmin ?? null : null,
        }),
      })),
    } as unknown as Model<Admin>;

    insertedAdmin = undefined;
    storedAdmin = undefined;
    service = new AuthService(model);
    await service.onModuleInit();
  });

  afterAll(() => {
    if (originalEnvironment.email === undefined) delete process.env.ADMIN_EMAIL;
    else process.env.ADMIN_EMAIL = originalEnvironment.email;
    if (originalEnvironment.password === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = originalEnvironment.password;
    if (originalEnvironment.secret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = originalEnvironment.secret;
  });

  it('hashes the initial password and issues a verifiable signed session', async () => {
    expect(insertedAdmin?.passwordHash).toContain(':');
    expect(insertedAdmin?.passwordHash).not.toBe(password);

    const token = await service.authenticate(email, password);
    expect(service.verifySession(token)).toEqual(
      expect.objectContaining({ sub: 'admin-id', email, role: 'admin' }),
    );
    await expect(
      service.authenticate('another-admin@example.com', password),
    ).rejects.toMatchObject({ status: 401 });
    expect(service.verifySession(`${token}tampered`)).toBeNull();

    const signPayload = (payload: Record<string, unknown>) => {
      const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
      const signature = createHmac('sha256', sessionSecret)
        .update(encoded)
        .digest('base64url');
      return `${encoded}.${signature}`;
    };
    const expiration = Math.floor(Date.now() / 1000) + 60 * 60;
    expect(
      service.verifySession(
        signPayload({ sub: 'traveler-id', email, exp: expiration, role: 'traveler' }),
      ),
    ).toBeNull();
    expect(
      service.verifySession(
        signPayload({
          sub: 'other-admin-id',
          email: 'another-admin@example.com',
          exp: expiration,
          role: 'admin',
        }),
      ),
    ).toBeNull();
  });

  it('updates the stored admin password to match the configured password', async () => {
    const nextPassword = 'NewConfiguredAdminPassword!2026';
    process.env.ADMIN_PASSWORD = nextPassword;

    await service.onModuleInit();

    expect(storedAdmin?.save).toHaveBeenCalledTimes(1);
    await expect(service.authenticate(email, nextPassword)).resolves.toEqual(
      expect.any(String),
    );
    await expect(service.authenticate(email, password)).rejects.toMatchObject({
      status: 401,
    });
  });
});
