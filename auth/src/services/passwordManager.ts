import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class PasswordManager {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');

    const hashedPasswordBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
    const hashedPassword = hashedPasswordBuffer.toString('hex');

    return `${hashedPassword}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [storedHashedPassword, salt] = storedPassword.split('.');

    const hashedPasswordBuffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    const hashedPassword = hashedPasswordBuffer.toString('hex');

    return hashedPassword === storedHashedPassword;
  }
}
