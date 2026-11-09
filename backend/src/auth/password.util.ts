import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

export function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('base64url');
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) return reject(error);
      resolve(`${salt}:${derivedKey.toString('base64url')}`);
    });
  });
}

export function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, encodedHash] = storedHash.split(':');
  if (!salt || !encodedHash) return Promise.resolve(false);
  const expected = Buffer.from(encodedHash, 'base64url');
  return new Promise((resolve, reject) => {
    scrypt(password, salt, expected.length, (error, derivedKey) => {
      if (error) return reject(error);
      resolve(
        expected.length === derivedKey.length &&
          timingSafeEqual(expected, derivedKey),
      );
    });
  });
}
